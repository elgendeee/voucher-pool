import Joi from 'joi';

const futureDate = (value: Date, helpers: Joi.CustomHelpers) => {
    if (value < new Date()) {
        return helpers.error('date.future');
    }
    return value;
};

export const createVoucherSchema = Joi.object({
    customerId: Joi.number().integer().positive().required().messages({
        'number.base': 'Customer ID must be a number',
        'number.integer': 'Customer ID must be an integer',
        'number.positive': 'Customer ID must be positive',
        'any.required': 'Customer ID is required'
    }),
    specialOfferId: Joi.number().integer().positive().required().messages({
        'number.base': 'Special Offer ID must be a number',
        'number.integer': 'Special Offer ID must be an integer',
        'number.positive': 'Special Offer ID must be positive',
        'any.required': 'Special Offer ID is required'
    }),
    expirationDate: Joi.date().custom(futureDate).required().messages({
        'date.base': 'Expiration date must be a valid date',
        'date.future': 'Expiration date must be in the future',
        'any.required': 'Expiration date is required'
    }),
    code: Joi.string().min(8).optional().messages({
        'string.base': 'Code must be a string',
        'string.min': 'Code must be at least 8 characters long',
        'string.empty': 'Code cannot be empty'
    })
});

export const generateVouchersSchema = Joi.object({
    specialOfferId: Joi.number().integer().positive().required().messages({
        'number.base': 'Special Offer ID must be a number',
        'number.integer': 'Special Offer ID must be an integer',
        'number.positive': 'Special Offer ID must be positive',
        'any.required': 'Special Offer ID is required'
    }),
    expirationDate: Joi.date().custom(futureDate).required().messages({
        'date.base': 'Expiration date must be a valid date',
        'date.future': 'Expiration date must be in the future',
        'any.required': 'Expiration date is required'
    }),
    customerIds: Joi.array().items(
        Joi.number().integer().positive().required()
    ).min(1).required().messages({
        'array.base': 'Customer IDs must be an array',
        'array.min': 'At least one customer ID must be provided',
        'any.required': 'Customer IDs are required'
    })
});

export const redeemVoucherSchema = Joi.object({
    code: Joi.string().required().messages({
        'string.base': 'Voucher code must be a string',
        'string.empty': 'Voucher code is required',
        'any.required': 'Voucher code is required'
    }),
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

export const codeParamSchema = Joi.object({
    code: Joi.string().required().messages({
        'string.base': 'Code must be a string',
        'string.empty': 'Code is required',
        'any.required': 'Code is required'
    })
});