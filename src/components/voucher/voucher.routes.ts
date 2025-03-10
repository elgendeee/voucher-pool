import { Router } from 'express';
import { VoucherController } from './voucher.controller';
import {
    createVoucherSchema,
    generateVouchersSchema,
    redeemVoucherSchema,
    idParamSchema,
    codeParamSchema
} from './voucher.validation-schema';
import { rateLimiter } from '../../middlewares/rate-limiter.middleware';
import { validate, ValidationSource } from '../../middlewares/validation.middleware';

const router = Router();
const voucherController = new VoucherController();

router.get('/', rateLimiter, voucherController.getAllVouchers);

router.get('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    voucherController.getVoucherById
);

router.get('/code/:code',
    rateLimiter,
    validate(codeParamSchema, ValidationSource.PARAMS),
    voucherController.getVoucherByCode
);

router.post('/',
    rateLimiter,
    validate(createVoucherSchema),
    voucherController.createVoucher
);

router.post('/generate',
    rateLimiter,
    validate(generateVouchersSchema),
    voucherController.generateVouchers
);

router.post('/redeem',
    rateLimiter,
    validate(redeemVoucherSchema),
    voucherController.redeemVoucher
);

export default router;