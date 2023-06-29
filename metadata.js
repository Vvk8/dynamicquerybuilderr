//Metadata.js
const Joi = require('joi');

// Define validation schema
const dataSchema = Joi.object({
    emp_id: Joi.string().required(),
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phonenumber: Joi.string()
        .pattern(/^\d{10}$/)
        .required(),
    designation: Joi.string().required(),
    location: Joi.string().required(),
    field1: Joi.string().required(),
    field2: Joi.number().integer().min(0).required(),
    // Add more fields and their validation rules as needed
});

module.exports = dataSchema;
