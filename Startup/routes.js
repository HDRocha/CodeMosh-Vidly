const logger = require('../util/logger');
const express = require('express');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const morgan = require('morgan'); //Morgan é um módulo que faz log das requisições HTTP
const genres = require('../routes/genres.js');
const customers = require('../routes/customers.js');
const movies = require('../routes/movies.js');
const home = require('../routes/home.js');
const rentals = require('../routes/rentals.js');
const users = require('../routes/users.js');
const returns = require('../routes/returns.js');
const error = require('../middleware/error'); //Só estamos utilizando esse módulo em uma das rotas (genres.js) mas o mais fácil é express-async-errors
const testando = require('../routes/testando');

module.exports = function (app) {
   app.use(express.static('public')); //Define o nome da pasta que irá guardar os objetos estáticos (ex: arquivos .txt, .pdf, css, etc) da aplicação. Quando der um get
   app.use(express.urlencoded({ extended: true })); //Verifica se no body da requisição existe um form url encoded no corpo da requisição (Mais utilizado antigamente)
   app.use(express.json()); //Essa instrução inclui um middleware no app que permitirá receber um objeto tipo json no body da requisição e dar um parse nele
   app.use(bodyParserErrorHandler()); //Trata qualquer erro que possa ter sido gerado no body.parser
   app.use('/', home);
   app.use('/api/genres', genres);
   app.use('/api/customers', customers);
   app.use('/api/movies', movies);
   app.use('/api/rentals', rentals);
   app.use('/api/users', users);
   app.use('/api/returns', returns);
   app.use('/api/testando', testando);

   if (app.get('env') === 'development') {
      //app.get('env') pega o valor da variável de ambiente NODE_ENV. Se NODE_ENV for undefined, essa função irá mudar p/ development. Através dessa variável podemos mudar o ambiente em que estamos.
      app.use(morgan('tiny')); //Utiliza um middleware que faz logs das requisições HTTP. Muito cuidado porque impacta na performance. Normalmente utilizado em desenvolvimento ou em alguns segundos de produção.
      logger.info(`Morgan enabled...`);
   }

   app.use(error);

   app.set('view engine', 'pug');
   app.set('views', '../views');
};
