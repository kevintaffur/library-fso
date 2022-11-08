require("dotenv").config();

const { MONGODB_URI, SECRET } = process.env;

module.exports = { MONGODB_URI, SECRET };
