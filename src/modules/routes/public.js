const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { permissions } = require("../../helpers/check_permissions");
const CategorieModel = require("../../models/categories.model");
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/categorias", async (req, res) => {
  if (res.locals.user && res.locals.user.permissions.includes("admin")) {
    return res.redirect("/admin/categorias");
  }
  try {
    const categories = await CategorieModel.find({});
    res.render("public/categorias", { categoria: categories });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
