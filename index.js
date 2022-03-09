require('dotenv').config(); //Executa a função que carrega as variáveis do arquivo .env
require('express-async-errors');   //Esse é um módulo que possibilita não ter que colocar todas as chamadas de funções assincronas dentro de um try/catch. Esse opção substitui o middleware error.js que nós criamos com a mesma função.
const error = require('../middleware/error'); //Só estamos utilizando esse módulo em uma das rotas (genres.js) mas o mais fácil é express-async-errors
const winston = require('winston');
const debug = require('debug')('app:production');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const morgan = require('morgan'); //Morgan é um módulo que faz log das requisições HTTP
const helmet = require('helmet');
const express = require('express');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const home = require('./routes/home.js');
const rentals = require('./routes/rentals.js');
const users = require('./routes/users.js');
const winston = require('winston');

console.log(process.env.TESTE_PASSWORD);

try{ 
    config.get('jwtPrivatekey');      
}
catch(ex){
    console.log('Variável de ambiente jwtPrivatekey não existe.')
    process.exit(1)
};


const app = express();
winston.add(winston.transports.File, { filename: 'logfile.log'});
app.use(helmet()); //Utiliza um middleware de proteção na requisição. É boa prática utilizar esse middleware.
app.use(express.static('public')); //Define o nome da pasta que irá guardar os objetos estáticos (ex: arquivos .txt, .pdf, css, etc) da aplicação. Quando der um get
app.use(express.urlencoded({ extended: true })); //Verifica se no body da requisição existe um form url encoded no corpo da requisição (Mais utilizado antigamente)
app.use(express.json()); //Essa instrução inclui um middleware no app que permitirá receber um objeto tipo json no body da requisição e dar um parse nele
app.use(bodyParserErrorHandler()); //Trata qualquer erro que possa ter sido gerado no body.parser
app.use(logger);  //Chama um middleware de teste de log que fizemos.
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

app.use(error);



app.set('view engine', 'pug');
app.set('views', './views');

debug(`NODE_ENV: ${process.env.NODE_ENV}`);

const port = process.env.PORT || 3000;


//db connection
//dbDebugger(`Conectado ao banco de dados...`);

//Configuration
debug(`Application name: ${config.get('name')}`);
debug(`Mail name: ${config.get('mail.host')}`);
debug(`Mail password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {   //app.get('env') pega o valor da variável de ambiente NODE_ENV. Se NODE_ENV for undefined, essa função irá mudar p/ development. Através dessa variável podemos mudar o ambiente em que estamos.
    app.use(morgan('tiny')); //Utiliza um middleware que faz logs das requisições HTTP. Muito cuidado porque impacta na performance. Normalmente utilizado em desenvolvimento ou em alguns segundos de produção.
    debug(`Morgan enabled...`);

}

mongoose.connect('mongodb://localhost:27017/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Db connected'))
    .catch(err => console.log('Erro de conexão!', err));




app.listen(port, () => {
    console.log(`Listening at port ${port}...`);
});

