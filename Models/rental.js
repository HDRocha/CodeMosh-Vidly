const Joi = require('joi');
require('../Startup/validation')();

const mongoose = require('mongoose');

//Joi rental schema
const rentalSchemaJoi = Joi.object({
   customerId: Joi.objectId().required(),
   movies: Joi.array().items({
      movieId: Joi.objectId().required(),
      expectedReturnDate: Joi.date().required(),
   }),
});

//Mongoose rental schema
const rentalSchema = new mongoose.Schema({
   dateOut: {
      type: Date,
      default: Date.now,
   },
   customer: {
      type: new mongoose.Schema({
         _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
         },
         name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
         },
         isGold: {
            type: Boolean,
            default: false,
         },
         phone: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
         },
      }),
      required: true,
   },
   movies: {
      type: [
         new mongoose.Schema({
            _id: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Movie',
            },
            title: {
               type: String,
               required: true,
               minlength: 5,
               maxlength: 50,
            },
            expectedReturnDate: {
               type: Date,
               required: true,
            },
            dateReturned: {
               type: Date,
            },
            dailyRentalRate: {
               type: Number,
               required: true,
            },
         }),
      ],
      required: true,
   },
   rentalFee: {
      type: Number,
      min: 0,
   },
});

//Mongoose rental Model
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
   return rentalSchemaJoi.validate(rental);
}

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.validate = validateRental;
