import { VoucherRepository } from './voucher.repository';
import { CustomerService } from '../customer/customer.service';
import { SpecialOfferService } from '../special-offer/special-offer.service';
import {
    ICreateVoucherDto,
    IGenerateVouchersDto,
    IRedeemVoucherDto,
    IVoucherResponseDto,
    IVoucherWithDetailsDto,
    IRedeemVoucherResponseDto,
    ICustomerVouchersResponseDto
} from './interfaces';
import crypto from 'crypto';

export class VoucherService {
    private voucherRepository: VoucherRepository;
    private customerService: CustomerService;
    private specialOfferService: SpecialOfferService;

    constructor() {
        this.voucherRepository = new VoucherRepository();
        this.customerService = new CustomerService();
        this.specialOfferService = new SpecialOfferService();
    }

    async getAllVouchers(): Promise<IVoucherResponseDto[]> {
        return this.voucherRepository.findAll();
    }

    async getVoucherById(id: number): Promise<IVoucherResponseDto | null> {
        return this.voucherRepository.findById(id);
    }

    async getVoucherByCode(code: string): Promise<IVoucherWithDetailsDto | null> {
        return this.voucherRepository.findByCode(code);
    }

    async getValidVouchersByEmail(email: string): Promise<ICustomerVouchersResponseDto> {
        const customer = await this.customerService.getCustomerByEmail(email);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const vouchers = await this.voucherRepository.findValidVouchersByEmail(email);

        return {
            email,
            vouchers
        };
    }

    async createVoucher(voucherData: ICreateVoucherDto): Promise<IVoucherResponseDto> {
        // Check if customer exists
        const customer = await this.customerService.getCustomerById(voucherData.customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Check if special offer exists
        const specialOffer = await this.specialOfferService.getSpecialOfferById(voucherData.specialOfferId);
        if (!specialOffer) {
            throw new Error('Special offer not found');
        }

        // Generate a random code if not provided
        const voucherWithCode = {
            ...voucherData,
            code: voucherData.code || this.generateVoucherCode()
        };

        return this.voucherRepository.create(voucherWithCode);
    }

    async generateVouchers(generateData: IGenerateVouchersDto): Promise<IVoucherResponseDto[]> {
        // Check if special offer exists
        const specialOffer = await this.specialOfferService.getSpecialOfferById(generateData.specialOfferId);
        if (!specialOffer) {
            throw new Error('Special offer not found');
        }

        // Check if all customers exist
        const customerPromises = generateData.customerIds.map(id => this.customerService.getCustomerById(id));
        const customers = await Promise.all(customerPromises);

        const missingCustomers = customers.filter(customer => !customer);
        if (missingCustomers.length > 0) {
            throw new Error('One or more customers not found');
        }

        // Create voucher data for each customer with generated codes
        const vouchersData = generateData.customerIds.map(customerId => ({
            customerId,
            specialOfferId: generateData.specialOfferId,
            expirationDate: generateData.expirationDate,
            code: this.generateVoucherCode()
        }));

        return this.voucherRepository.createMany(vouchersData);
    }

    async redeemVoucher(redeemData: IRedeemVoucherDto): Promise<IRedeemVoucherResponseDto> {
        return this.voucherRepository.isVoucherValid(redeemData.code, redeemData.email);
    }

    private generateVoucherCode(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 12;

        return Array.from(
            { length: codeLength },
            () => characters.charAt(crypto.randomInt(characters.length))
        ).join('');
    }
}