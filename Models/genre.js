const Joi = require('joi');
const mongoose = require('mongoose');


//Joi schema
const genreSchemaJoi = Joi.object({
    name: Joi.string().min(3).required()
});

//Genre schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})


//Mongoose model
const Genre = mongoose.model('Genre', genreSchema);

//Valida o schema genre
function validateSchema(genre) {
    return genreSchemaJoi.validate(genre);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateSchema;