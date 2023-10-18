// Importe o Express e o modelo de Stream
const express = require("express");
const Stream = require("../../models/streamSchema.model");

const router = express.Router();

// Rota para criar uma nova transmissão
router.post("/create-stream", async (req, res) => {
  try {
    const { userId, streamName, platform, metadata } = req.body;

    // Crie uma nova transmissão no banco de dados
    const newStream = new Stream({
      userId,
      streamName,
      platform,
      metadata,
    });

    // Salve a transmissão no banco de dados
    await newStream.save();

    return res.status(201).json(newStream);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar a transmissão." });
  }
});

// Rota para iniciar uma transmissão
router.post("/start-stream/:streamId", async (req, res) => {
  try {
    const streamId = req.params.streamId;

    // Encontre a transmissão no banco de dados
    const stream = await Stream.findById(streamId);

    if (!stream) {
      return res.status(404).json({ error: "Transmissão não encontrada." });
    }

    // Atualize o status da transmissão para "ativo"
    stream.status = "ativo";

    // Salve a transmissão atualizada no banco de dados
    await stream.save();

    return res.status(200).json(stream);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao iniciar a transmissão." });
  }
});

// Rota para parar uma transmissão
router.post("/stop-stream/:streamId", async (req, res) => {
  try {
    const streamId = req.params.streamId;

    // Encontre a transmissão no banco de dados
    const stream = await Stream.findById(streamId);

    if (!stream) {
      return res.status(404).json({ error: "Transmissão não encontrada." });
    }

    // Atualize o status da transmissão para "inativo"
    stream.status = "inativo";

    // Salve a transmissão atualizada no banco de dados
    await stream.save();

    return res.status(200).json(stream);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao parar a transmissão." });
  }
});

// Rota para listar todas as transmissões
router.get("/list-streams", async (req, res) => {
  try {
    // Consulte o banco de dados para obter todas as transmissões
    const streams = await Stream.find();

    return res.status(200).json(streams);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar as transmissões." });
  }
});

// Rota para atualizar informações da transmissão
router.put("/update-stream/:streamId", async (req, res) => {
  try {
    const streamId = req.params.streamId;
    const { streamName, metadata } = req.body;

    // Encontre a transmissão no banco de dados
    const stream = await Stream.findById(streamId);

    if (!stream) {
      return res.status(404).json({ error: "Transmissão não encontrada." });
    }

    // Atualize as informações da transmissão
    stream.streamName = streamName;
    stream.metadata = metadata;

    // Salve a transmissão atualizada no banco de dados
    await stream.save();

    return res.status(200).json(stream);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao atualizar as informações da transmissão." });
  }
});

// Rota para excluir uma transmissão
router.delete("/delete-stream/:streamId", async (req, res) => {
  try {
    const streamId = req.params.streamId;

    // Encontre a transmissão no banco de dados
    const stream = await Stream.findById(streamId);

    if (!stream) {
      return res.status(404).json({ error: "Transmissão não encontrada." });
    }

    // Exclua a transmissão do banco de dados
    await stream.remove();

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir a transmissão." });
  }
});

// Rota para listar todas as transmissões ativas
router.get("/active-streams", async (req, res) => {
  try {
    // Consulte o banco de dados para obter todas as transmissões ativas (aquelas que estão em andamento)
    const activeStreams = await Stream.find({ status: "active" });

    return res.status(200).json(activeStreams);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao listar as transmissões ativas." });
  }
});

// Rota para visualizar uma transmissão ativa
router.get("/view-stream/:streamId", async (req, res) => {
  try {
    const streamId = req.params.streamId;

    // Encontre a transmissão ativa no banco de dados
    const activeStream = await Stream.findOne({
      _id: streamId,
      status: "active",
    });

    if (!activeStream) {
      return res
        .status(404)
        .json({ error: "Transmissão não encontrada ou não está ativa." });
    }

    // Use tecnologias de streaming de vídeo (HLS, DASH, etc.) para transmitir o vídeo ao vivo
    // Implemente o streaming de vídeo de acordo com as preferências de tecnologia e plataforma.

    // Exemplo simples: envie um URL de transmissão ao vivo para o cliente
    const streamURL = activeStream.streamURL;

    return res.status(200).json({ streamURL });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao visualizar a transmissão." });
  }
});

module.exports = router;
