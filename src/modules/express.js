const express = require("express");
const UserModel = require("../models/user.model");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const register = require("./routes/register");
const login = require("./routes/login");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "public")));
const session = require("express-session");
const flash = require("connect-flash");

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Rotas
app.use("/admin", admin);
app.use("/register", register);
app.use("/login", login);

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

const port = 8080;
app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));
