import { Router } from 'express';
import { SpecialOfferController } from './special-offer.controller';
import { createSpecialOfferSchema, updateSpecialOfferSchema, idParamSchema } from './special-offer.validation-schema';
import { rateLimiter } from '../../middlewares/rate-limiter.middleware';
import { validate, ValidationSource } from '../../middlewares/validation.middleware';

const router = Router();
const specialOfferController = new SpecialOfferController();

router.get('/', rateLimiter, specialOfferController.getAllSpecialOffers);

router.get('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    specialOfferController.getSpecialOfferById
);

router.post('/',
    rateLimiter,
    validate(createSpecialOfferSchema),
    specialOfferController.createSpecialOffer
);

router.put('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    validate(updateSpecialOfferSchema),
    specialOfferController.updateSpecialOffer
);

router.delete('/:id',
    rateLimiter,
    validate(idParamSchema, ValidationSource.PARAMS),
    specialOfferController.deleteSpecialOffer
);

export default router;