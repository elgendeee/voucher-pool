import { Router } from 'express';
import customerRoutes from '../components/customer/customer.routes';
import specialOfferRoutes from '../components/special-offer/special-offer.routes';
import voucherRoutes from '../components/voucher/voucher.routes';

const router = Router();

// Register routes
router.use('/customers', customerRoutes);
router.use('/special-offers', specialOfferRoutes);
router.use('/vouchers', voucherRoutes);

export default router;