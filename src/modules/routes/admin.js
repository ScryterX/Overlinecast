const express = require("express");
const UserModel = require("../../models/user.model");
const router = express.Router();
const mongoose = require("mongoose");
const CategorieModel = require("../../models/categories.model");
// const Categories = mongoose.model("Categories");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const { permissions } = require("../../helpers/check_permissions");
router.get("/", (req, res) => {
  res.render("admin/admin");
});

router.get("/categorias", permissions, async (req, res) => {
  try {
    const categories = await CategorieModel.find({});
    res.render("admin/categorias", { categoria: categories, user: req.user });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/categorias/add", permissions, (req, res) => {
  res.render("admin/categorias/addcategorias");
});

router.post("/categorias/nova", permissions, async (req, res) => {
  // Defina um esquema de validação para os dados do formulário
  const categoriaSchema = Joi.object({
    name: Joi.string().min(5).required(),
    slug: Joi.string()
      .regex(/^[a-zA-Z0-9-]+$/)
      .required(),
  });
  try {
    // Valide os dados do formulário usando o esquema
    const { error, value } = categoriaSchema.validate(req.body);

    if (error) {
      req.flash("error_msg", "Erro ao salvar: " + error);
      return res.status(400).redirect("/admin/categorias");
      // return res.status(400).render("badRequest", { bodyErrors: error });
    }
    const newCategorie = await CategorieModel.create({
      name: req.body.name,
      slug: req.body.slug,
    });
    req.flash(
      "success_msg",
      "Categoria " + req.body.name + " criada com sucesso!"
    );
    res.redirect("/admin/categorias");
    // res.status(201).json(newCategorie);
  } catch (error) {
    res.status(500).render("badRequest", { bodyErrors: error.message });
  }
});

router.get("/categorias/edit/:id", permissions, async (req, res) => {
  try {
    var id = req.params.id;
    const item = await CategorieModel.findById(id);
    res.render("admin/categorias/editcategoria", { categoria: item });
  } catch (error) {
    res.status(500).render("badRequest", { bodyErrors: error.message });
  }
});

router.post("/categorias/edit", permissions, async (req, res) => {
  // Defina um esquema de validação para os dados do formulário
  const categoriaSchema = Joi.object({
    name: Joi.string().min(5).required(),
    slug: Joi.string()
      .regex(/^[a-zA-Z0-9-]+$/)
      .required(),
  });
  try {
    const id = req.body.id; // Obtenha o ID da categoria a ser atualizada
    const name = req.body.name;
    const slug = req.body.slug;

    // Primeiro, verifique se o ID é válido antes de prosseguir
    if (!id) {
      req.flash("error_msg", "ID da categoria não fornecido.");
      return res.redirect("/admin/categorias");
    }

    // Em seguida, verifique se a categoria com o ID fornecido existe
    const categoria = await CategorieModel.findById(id);

    if (!categoria) {
      req.flash("error_msg", "Categoria não encontrada.");
      return res.redirect("/admin/categorias");
    }

    // Atualize os campos da categoria
    categoria.name = name;
    categoria.slug = slug;

    // Salve a categoria atualizada no banco de dados
    await categoria.save();

    req.flash("success_msg", "Categoria atualizada com sucesso.");
    return res.redirect("/admin/categorias");
  } catch (error) {
    res.status(500).render("badRequest", { bodyErrors: error.message });
  }
});

router.post("/categorias/deletar", permissions, async (req, res) => {
  try {
    const id = req.body.id; // Obtenha o ID da categoria a ser atualizada

    if (!id) {
      req.flash("error_msg", "ID da categoria não fornecido.");
      return res.redirect("/admin/categorias");
    }
    const categoria = await CategorieModel.findById(id);
    if (!categoria) {
      req.flash("error_msg", "Categoria não encontrada.");
      return res.redirect("/admin/categorias");
    }
    categoria.deleteOne();
    req.flash("success_msg", "Categoria deletada com sucesso.");
    return res.redirect("/admin/categorias");
  } catch (error) {
    res.status(500).render("badRequest", { bodyErrors: error.message });
  }
});
router.get("/users", permissions, async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.status(201).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
