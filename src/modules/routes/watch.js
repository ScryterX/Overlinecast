const express = require("express");
const router = express.Router();
const UserModel = require("../../models/user.model"); // Importando o UserModel

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await UserModel.findOne({ username: username });

    if (!user || !user.StreamId) {
      return res.status(404).send("Transmissão não encontrada.");
    }

    const streamUrl = `http://localhost:8000/live/${user.StreamId}/index.m3u8`;

    res.render("public/watch", { streamUrl: streamUrl });
  } catch (error) {
    res.status(500).send("Erro ao acessar a transmissão.");
  }
});

module.exports = router;
