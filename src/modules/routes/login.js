const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../config/auth");

router.get("/", async (req, res) => {
  res.render("login/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Erro interno do servidor
      return next(err);
    }
    if (!user) {
      // Autenticação falhou, exibe mensagem de erro
      req.flash("error_msg", "Login ou senha incorretos.");
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        // Erro interno do servidor
        return next(err);
      }
      // Autenticação bem-sucedida, redireciona para a página desejada
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
});

module.exports = router;
