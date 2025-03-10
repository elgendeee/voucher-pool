import Joi from 'joi';

export const createSpecialOfferSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
        'string.base': 'Name must be a string',
        'any.required': 'Name is required'
    }),
    discountPercentage: Joi.number().min(0).max(100).required().messages({
        'number.base': 'Discount percentage must be a number',
        'number.min': 'Discount percentage must be at least 0',
        'number.max': 'Discount percentage cannot be more than 100',
        'any.required': 'Discount percentage is required'
    })
});

export const updateSpecialOfferSchema = Joi.object({
    name: Joi.string().trim().optional().messages({
        'string.empty': 'Name cannot be empty',
        'string.base': 'Name must be a string'
    }),
    discountPercentage: Joi.number().min(0).max(100).optional().messages({
        'number.base': 'Discount percentage must be a number',
        'number.min': 'Discount percentage must be at least 0',
        'number.max': 'Discount percentage cannot be more than 100'
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required'
    })
});