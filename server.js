import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import crypto from "crypto";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;

const bot = new TelegramBot(TOKEN, { polling: true });
const loginTokens = {}; // simpan token sementara

bot.onText(/\/login/, (msg) => {
  const chatId = msg.chat.id;
  const token = crypto.randomBytes(16).toString("hex");
  loginTokens[token] = chatId;
  const loginUrl = `${BASE_URL}/auth/telegram?token=${token}`;
  bot.sendMessage(chatId, `🔗 Klik link berikut untuk login:\n${loginUrl}`);
});

app.get("/auth/telegram", (req, res) => {
  const token = req.query.token;
  const chatId = loginTokens[token];
  if (!chatId) return res.status(400).send("Token tidak valid ❌");
  bot.sendMessage(chatId, "✅ Login berhasil! Selamat datang 🎉");
  delete loginTokens[token];
  res.send("<h2>Login berhasil! Kembali ke Telegram</h2>");
});

app.get("/", (req, res) => res.send("✅ Telegram Login API aktif!"));

app.listen(PORT, () => console.log(`Server aktif di port ${PORT}`));
