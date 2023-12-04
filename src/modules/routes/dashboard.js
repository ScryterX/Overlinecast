const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { permissions } = require("../../helpers/check_permissions");
const CategoryModel = require("../../models/categories.model");
const UserModel = require("../../models/user.model");
// Em seu controlador
const serverInfo = {
  ip: "rtmp://localhost",
  port: 1935, // Ou a porta que você está usando
  app: "/live", // Nome do aplicativo RTMP
  key: "STREAMID",
};

router.get("/", permissions(["user"]), async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.render("users/dashboard", { serverInfo, categories: categories });
  } catch (error) {
    // Trate os erros conforme necessário
  }
});

// No seu arquivo de rota
router.post(
  "/path-to-update-category",
  permissions(["user"]),
  async (req, res) => {
    console.log(req.body); // Para depuração
    try {
      const userId = req.user._id; // Supondo que você está usando sessões de usuário
      const selectedCategory = req.body.selectedCategory;

      await UserModel.findByIdAndUpdate(userId, {
        selectedCategory: selectedCategory,
      });

      res.redirect("/dashboard");
    } catch (error) {
      // Trate os erros conforme necessário
    }
  }
);

// Rota que requer qualquer uma das permissões 'admin', 'moderator', 'user'
// router.get("/", permissions(["user"]), (req, res) => {
//   // Lógica da rota
//   res.render("users/dashboard", { serverInfo });
// });

// router.get("/", permissions, (req, res) => {
//   res.render("users/dashboard", { serverInfo });
// });

module.exports = router;
