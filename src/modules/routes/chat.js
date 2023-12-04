const express = require("express");
const router = express.Router();
const tmi = require("tmi.js");
const YouTubeChat = require("youtube-chat").YouTubeChat;

// Estrutura para armazenar mensagens
let chatMessages = [];

// Configuração do cliente Twitch
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: ["scryterx"],
});

twitchClient.connect();

twitchClient.on("message", (channel, tags, message, self) => {
  // Adiciona mensagens do Twitch à estrutura
  chatMessages.push({ source: "Twitch", message });
});

// Configuração do cliente YouTube
// Supondo que você esteja usando OAuth 2.0
const ytChat = new YouTubeChat({
  clientId: `${process.env.YT_CHAT_ID}`,
  clientSecret: `${process.env.YT_CHAT_SECRET}`,
  redirectUri: "SEU_REDIRECT_URI",
  refreshToken: "SEU_REFRESH_TOKEN", // Obtido após a autenticação inicial
});

// Substitua 'SEU_CHANNEL_ID' pelo ID do canal do YouTube
ytChat.authenticate().then(() => ytChat.listen("SEU_CHANNEL_ID"));

ytChat.on("message", (message) => {
  // Lógica para lidar com mensagens do YouTube
  io.emit("chat message", {
    source: "YouTube",
    message: message.snippet.displayMessage,
  });
});

// Rota para obter mensagens unificadas do chat
router.get("/unified-chat", (req, res) => {
  // Retorna as mensagens unificadas
  res.json({ messages: chatMessages });
  // Opcional: limpar o array após enviar as mensagens
  chatMessages = [];
});

module.exports = router;
