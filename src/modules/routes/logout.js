const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  req.logout((err) => {
    if (err) {
      // Lidar com erros de logout, se necessário
      console.error(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
