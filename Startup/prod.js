const helmet = require('helmet');
const compression = require('compression');

module.exports = function (app) {
   app.use(helmet()); //Utiliza um middleware de proteção na requisição. É boa prática utilizar esse middleware.
   app.use(compression());
};
