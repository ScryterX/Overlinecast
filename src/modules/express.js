const express = require("express");
const UserModel = require("../models/user.model");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const register = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const dashboard = require("./routes/dashboard");
const public = require("./routes/public");
const streamRouter = require("./routes/stream");
const watch = require("./routes/watch");
const nms = require("./routes/nms");

nms.run();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "public")));
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./../config/auth")(passport);

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Rotas
app.use("/admin", admin);
app.use("/register", register);
app.use("/login", login);
app.use("/logout", logout);
app.use("/dashboard", dashboard);
app.use("/", public);
app.use("/streams", streamRouter);
app.use("/watch", watch);

app.set("view engine", "ejs");
app.set("views", "src/views");

// // Lógica de WebSocket
// io.on("connection", (socket) => {
//   console.log("Usuário conectado");

//   // Pode implementar funcionalidades adicionais aqui
// });
// router.get("/", (req, res) => {
//   res.render("public/main");
// });
// app.get("/home", (req, res) => {
//   res.contentType("application/html");
//   res.status(200).send("<h1>Hello World</h1>");
// });

// app.get("/users", async (req, res) => {
//   try {
//     const users = await UserModel.find({});

//     res.status(201).json(users);
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// });

// app.get("/users/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const users = await UserModel.findById(id);

//     return res.status(201).json(users);
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// });

// app.get("/views/users", async (req, res) => {
//   const users = await UserModel.find({});
//   res.render("index", { users: users });
// });
// app.post("/users", async (req, res) => {
//   try {
//     const user = await UserModel.create(req.body);

//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.patch("/users/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// app.delete("/users/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await UserModel.findByIdAndDelete(id);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

const port = 8080;
app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));
