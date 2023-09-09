const mongodb = require("mongodb");
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@middleware.10ghkz4.mongodb.net/?retryWrites=true&w=majority`;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@middleware.10ghkz4.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Conexão ao banco de dados realizada com sucesso!");
  } catch (error) {
    console.error(
      "Ocorreu um erro ao se conectar com o banco de dados:",
      error
    );
  }
};

module.exports = connectToDatabase;
