module.exports = {
  permissions: function (req, res, next) {
    if (req.isAuthenticated()) {
      // Verifica se o usuário é admin e user OU é moderator
      if (
        (req.user.permissions.includes("user") &&
          req.user.permissions.includes("admin")) ||
        req.user.permissions.includes("moderator")
      ) {
        console.log(
          "Login efetuado com sucesso. O usuário registrado contém as seguintes permissões: " +
            req.user.permissions
        );
        return next();
      }

      // Verifica se o usuário é apenas user
      if (req.user.permissions.includes("user")) {
        req.flash(
          "error_msg",
          "Você chegou muito longe, forasteiro! Volte 2 casas e siga seu caminho."
        );
        return res.redirect("/dashboard");
      }
    }

    // Usuário não está autenticado ou não atendeu a nenhuma das condições acima
    req.flash("error_msg", "Faça login para continuar");
    res.redirect("/login");
  },
};
