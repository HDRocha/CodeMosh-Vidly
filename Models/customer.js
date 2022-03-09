const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),    
    phone : Joi.string().min(3).max(50).required(),
    isGold : Joi.boolean()
});

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    phone: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50        
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateSchema(customer) {        
    return customerSchema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateSchema;