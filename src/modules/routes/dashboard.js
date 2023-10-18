const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { permissions } = require("../../helpers/check_permissions");
// Em seu controlador
const serverInfo = {
  ip: "localhost",
  port: 1935, // Ou a porta que você está usando
  app: "live", // Nome do aplicativo RTMP
};

router.get("/", permissions, (req, res) => {
  res.render("users/dashboard", { serverInfo });
});

module.exports = router;
