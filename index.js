// const { Person } = require("./src/person.js");
const dotenv = require("dotenv");

const connectToDatabase = require("./src/database/connect");

dotenv.config();

connectToDatabase();

// // require("./modules/path");
// require("./modules/fs");
// require("./modules/http");

require("./src/modules/express.js");
// const person = new Person("Josiel");
// console.log(person.sayMyName());
