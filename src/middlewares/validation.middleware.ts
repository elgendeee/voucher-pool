import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export enum ValidationSource {
    BODY = 'body',
    PARAMS = 'params',
    QUERY = 'query'
}

export const validate = (
    schema: Joi.ObjectSchema,
    source: ValidationSource = ValidationSource.BODY
) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).json({
                message: 'Validation error',
                errors
            });
            return;
        }

        req[source] = value;
        next();
    } catch (err) {
        next(err);
    }
};