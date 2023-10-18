// Importe o Mongoose
const mongoose = require("mongoose");

// Defina o esquema para as transmissões
const streamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ID do usuário que está fazendo a transmissão
    required: true,
  },
  streamName: {
    type: String, // Nome da transmissão
    required: true,
  },
  platform: {
    type: String, // Plataforma de destino (Twitch, YouTube, etc.)
    required: true,
  },
  status: {
    type: String, // Status da transmissão (ativo ou inativo)
    required: true,
    default: "inativo",
  },
  metadata: {
    type: String, // Outras informações ou metadados da transmissão
  },
});

// Crie o modelo de Stream
const Stream = mongoose.model("Stream", streamSchema);

module.exports = Stream;
