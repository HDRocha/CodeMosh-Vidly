require("dotenv").config(); //Executa a função que carrega as variáveis do arquivo .env
const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivatekey")) {
    throw new Error("FATAL ERROR: jwtPrivatekey is not defined.");
  }
};
