const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  res.render("login/login");
});

module.exports = router;
