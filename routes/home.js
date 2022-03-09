const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { title: 'My Express app', message: 'Hello World!'});   //Essa instrução retorna uma página html onde o esqueleto dela é montado é o arquivo index.pug e está na pasta views. 
                                                                                //O outro parâmetro é um objeto com as variáveis que irão substituir no modelo e injetar na página.
});

module.exports = router;