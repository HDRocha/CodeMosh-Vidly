const Joi = require('joi');
const mongoose = require('mongoose');

//Joi schema
const movieSchemaJoi = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
});

//Mongoose schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: new mongoose.Schema({
            _id: {
                type:  mongoose.Schema.Types.ObjectId,
                ref: 'Genre'
            },
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        })
    },

    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

//Mongoose model
const Movie = mongoose.model('Movie', movieSchema);

//Valida o schema
function validateSchema(movie) {    
    return movieSchemaJoi.validate(movie);    
}

module.exports.Movie = Movie;
module.exports.validate = validateSchema;