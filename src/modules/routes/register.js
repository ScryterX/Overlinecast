const express = require("express");
const UserModel = require("../../models/user.model");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  res.render("register/register");
});

router.get("/success", async (rec, res) => {
  res.render("register/success");
});

router.post("/registrar", async (req, res) => {
  // Remova o campo "confirmPassword" do objeto req.body
  const { confirmPassword, ...userData } = req.body;
  //falta validar se o email já existe e verificar se as senhas são iguais
  const userValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(12)
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
    // Se houver erros de validação, você pode tratar os erros aqui
    req.flash("error_msg", "Erro de validação: " + error.details[0].message);
    return res.redirect("/register"); // Redireciona de volta ao formulário de registro
  }
  try {
    // Verifique se o email já existe no banco de dados
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      req.flash(
        "error_msg",
        "Este email já está sendo usado por outro usuário."
      );
      return res.redirect("/register"); // Redireciona de volta ao formulário de registro
    }

    // Verifique se a senha e a repetição da senha são iguais
    if (req.body.password !== req.body.confirmPassword) {
      req.flash("error_msg", "As senhas não coincidem.");
      return res.redirect("/register"); // Redireciona de volta ao formulário de registro
    }

    // Crie um hash da senha
    const saltRounds = 10; // Número de rounds de sal para o bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Substitua a senha original pelo hash
    userData.password = hashedPassword;

    const user = await UserModel.create(userData);
    req.flash("success_msg", "Conta criada com sucesso!");
    return res.redirect("/register/success");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
