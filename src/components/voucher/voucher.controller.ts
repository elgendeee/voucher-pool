import { Request, Response } from 'express';
import { VoucherService } from './voucher.service';

export class VoucherController {
    private voucherService: VoucherService;

    constructor() {
        this.voucherService = new VoucherService();
    }

    getAllVouchers = async (req: Request, res: Response): Promise<void> => {
        try {
            const vouchers = await this.voucherService.getAllVouchers();
            res.status(200).json(vouchers);
        } catch (error) {
            console.error('Error getting all vouchers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getVoucherById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const voucher = await this.voucherService.getVoucherById(id);
            if (!voucher) {
                res.status(404).json({ message: 'Voucher not found' });
                return;
            }

            res.status(200).json(voucher);
        } catch (error) {
            console.error('Error getting voucher by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getVoucherByCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.params;
            if (!code) {
                res.status(400).json({ message: 'Voucher code is required' });
                return;
            }

            const voucher = await this.voucherService.getVoucherByCode(code);
            if (!voucher) {
                res.status(404).json({ message: 'Voucher not found' });
                return;
            }

            res.status(200).json(voucher);
        } catch (error) {
            console.error('Error getting voucher by code:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    createVoucher = async (req: Request, res: Response): Promise<void> => {
        try {
            const voucher = await this.voucherService.createVoucher(req.body);
            res.status(201).json(voucher);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
                return;
            }

            console.error('Error creating voucher:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    generateVouchers = async (req: Request, res: Response): Promise<void> => {
        try {
            const vouchers = await this.voucherService.generateVouchers(req.body);
            res.status(201).json(vouchers);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
                return;
            }

            console.error('Error generating vouchers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    redeemVoucher = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.voucherService.redeemVoucher(req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error redeeming voucher:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}