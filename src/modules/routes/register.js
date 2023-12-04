const express = require("express");
const UserModel = require("../../models/user.model");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  res.render("register/register");
});

router.get("/success", async (req, res) => {
  res.render("register/success");
});

router.post("/registrar", async (req, res) => {
  const { confirmPassword, ...userData } = req.body;

  // Adicionando validação para o campo username
  const userValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().required(), // Validando username
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*['!@#$%^&*])")
      )
      .required()
      .messages({
        "string.pattern.base":
          "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
      }),
  });

  const { error, value } = userValidationSchema.validate(userData);
  if (error) {
    req.flash("error_msg", "Erro de validação: " + error.details[0].message);
    return res.redirect("/register");
  }

  try {
    // Verifique se o email ou o username já existe no banco de dados
    const existingUserByEmail = await UserModel.findOne({
      email: req.body.email,
    });
    const existingUserByUsername = await UserModel.findOne({
      username: req.body.username,
    });

    if (existingUserByEmail) {
      req.flash(
        "error_msg",
        "Este email já está sendo usado por outro usuário."
      );
      return res.redirect("/register");
    }

    if (existingUserByUsername) {
      req.flash(
        "error_msg",
        "Este nome de usuário já está sendo usado por outro usuário."
      );
      return res.redirect("/register");
    }

    // Verifique se as senhas coincidem
    if (req.body.password !== req.body.confirmPassword) {
      req.flash("error_msg", "As senhas não coincidem.");
      return res.redirect("/register");
    }

    // Crie um hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Substitua a senha original pelo hash
    userData.password = hashedPassword;

    // Criação do novo usuário
    const user = await UserModel.create(userData);
    req.flash("success_msg", "Conta criada com sucesso!");
    return res.redirect("/register/success");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
