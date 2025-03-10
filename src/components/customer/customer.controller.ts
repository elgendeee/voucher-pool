import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import { VoucherService } from '../voucher/voucher.service';

export class CustomerController {
    private customerService: CustomerService;
    private voucherService: VoucherService;

    constructor() {
        this.customerService = new CustomerService();
        this.voucherService = new VoucherService();
    }

    getAllCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const customers = await this.customerService.getAllCustomers();
            res.status(200).json(customers);
        } catch (error) {
            console.error('Error getting all customers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getCustomerById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const customer = await this.customerService.getCustomerById(id);
            if (!customer) {
                res.status(404).json({ message: 'Customer not found' });
                return;
            }

            res.status(200).json(customer);
        } catch (error) {
            console.error('Error getting customer by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const customer = await this.customerService.createCustomer(req.body);
            res.status(201).json(customer);
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({ message: error.message });
                return;
            }

            console.error('Error creating customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const updatedCustomer = await this.customerService.updateCustomer(id, req.body);
            if (!updatedCustomer) {
                res.status(404).json({ message: 'Customer not found' });
                return;
            }

            res.status(200).json(updatedCustomer);
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({ message: error.message });
                return;
            }

            console.error('Error updating customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const deleted = await this.customerService.deleteCustomer(id);
            if (!deleted) {
                res.status(404).json({ message: 'Customer not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getValidVouchersByCustomerEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.params;

            const customerVouchers = await this.voucherService.getValidVouchersByEmail(email);
            res.status(200).json(customerVouchers);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
                return;
            }

            console.error('Error getting valid vouchers by customer ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}