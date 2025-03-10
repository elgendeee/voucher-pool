import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { createCustomerSchema, updateCustomerSchema, idParamSchema, emailParamSchema } from './customer.validation-schema';
import { rateLimiter } from '../../middlewares/rate-limiter.middleware';
import { validate, ValidationSource } from '../../middlewares/validation.middleware';

const router = Router();
const customerController = new CustomerController();

router.get('/', rateLimiter, customerController.getAllCustomers);

router.get('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    customerController.getCustomerById
);

router.get('/:email/vouchers',
    rateLimiter,
    validate(emailParamSchema, ValidationSource.PARAMS),
    customerController.getValidVouchersByCustomerEmail
);

router.post('/',
    rateLimiter,
    validate(createCustomerSchema),
    customerController.createCustomer
);

router.put('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    validate(updateCustomerSchema),
    customerController.updateCustomer
);

router.delete('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    customerController.deleteCustomer
);

export default router;