const logger = require('../util/logger');
require('express-async-errors'); //Esse é um módulo que possibilita não ter que colocar todas as chamadas de funções assincronas dentro de um try/catch. Esse opção substitui o middleware error.js que nós criamos com a mesma função.
module.exports = function () {
  //Esse método abaixo apenas funciona com código síncrono. Se um erro for gerado por uma função assíncrona ela não irá funcionar.
  process.on('uncaughtException', (ex) => {
    logger.error(ex.message, ex);
    process.exit(1);
  });

  //throw new Error('Erro de inicialização.'); //Apenas para teste.

  process.on('unhandledRejection', (ex) => {
    logger.error(ex.message, ex);
    process.exit(1);
  });
};
