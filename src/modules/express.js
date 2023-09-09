const express = require("express");
const UserModel = require("../models/user.model");
const port = 8080;
const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "src/views");

app.get("/home", (req, res) => {
  res.contentType("application/html");
  res.status(200).send("<h1>Hello World</h1>");
});

app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.status(201).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const users = await UserModel.findById(id);

    return res.status(201).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/views/users", async (req, res) => {
  const users = await UserModel.find({});
  res.render("index", { users: users });
});
app.post("/users", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByIdAndDelete(id);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));
