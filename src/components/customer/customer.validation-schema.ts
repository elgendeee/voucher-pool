import Joi from 'joi';

export const createCustomerSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
        'string.base': 'Name must be a string',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email format is invalid',
        'string.base': 'Email must be a string',
        'any.required': 'Email is required'
    })
});

export const updateCustomerSchema = Joi.object({
    name: Joi.string().trim().optional().messages({
        'string.empty': 'Name cannot be empty',
        'string.base': 'Name must be a string'
    }),
    email: Joi.string().email().optional().messages({
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email format is invalid',
        'string.base': 'Email must be a string'
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

export const emailParamSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email format is invalid',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    })
});

export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required'
    })
});