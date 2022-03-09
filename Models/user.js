const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');


//Joi schema
const userSchemaJoi = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
});

//Mongoose schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        requirede: true,
        minlength: 5,
        maxlength: 1024
    }
});

//Adiciona um novo método ao schema do usuário assim o próprio objeto usuário poderá gerar seu jwt (jsonWebToken)
userSchema.methods.generateAuthToken = function () {    
    console.log(config.get('jwtPrivatekey')); 
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivatekey'));    
    return token;
};

//Mongoose model
const User = mongoose.model('User', userSchema);

//Valida o schema user
function validateSchema(user) {
    return userSchemaJoi.validate(user);
}

module.exports.User = User;
module.exports.validate = validateSchema;