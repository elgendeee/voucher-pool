import Customer from '../components/customer/customer.model';
import SpecialOffer from '../components/special-offer/special-offer.model';
import Voucher from '../components/voucher/voucher.model';
import crypto from 'crypto';

const generateVoucherCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 12;

    return Array.from(
        { length: codeLength },
        () => characters.charAt(crypto.randomInt(characters.length))
    ).join('');
};

const generateRandomEmail = (baseName: string): string => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `${baseName.toLowerCase().replace(/\s+/g, '.')}.${timestamp}.${random}@example.com`;
};

export const seedDatabase = async (): Promise<void> => {
    console.log('Starting database seeding...');

    try {
        const customerData = [
            { name: 'John Doe', email: 'john.doe@example.com' },
            { name: 'Jane Smith', email: 'jane.smith@example.com' },
            { name: 'Bob Johnson', email: 'bob.johnson@example.com' },
            { name: 'Alice Williams', email: 'alice.williams@example.com' },
            { name: 'Chris Davis', email: 'chris.davis@example.com' }
        ];

        for (const customer of customerData) {
            const existingCustomer = await Customer.findOne({ where: { email: customer.email } });
            if (!existingCustomer) {
                await Customer.create(customer);
                console.log(`Created customer: ${customer.name}`);
            } else {
                const randomEmail = generateRandomEmail(customer.name);
                await Customer.create({
                    ...customer,
                    email: randomEmail
                });
                console.log(`Created customer with random email: ${randomEmail}`);
            }
        }

        const offerData = [
            { name: 'Summer Sale', discountPercentage: 15 },
            { name: 'New Customer Discount', discountPercentage: 10 },
            { name: 'Holiday Special', discountPercentage: 20 },
            { name: 'Loyalty Reward', discountPercentage: 25 },
            { name: 'Flash Sale', discountPercentage: 30 }
        ];

        for (const offer of offerData) {
            const existingOffer = await SpecialOffer.findOne({ where: { name: offer.name } });
            if (!existingOffer) {
                await SpecialOffer.create(offer);
                console.log(`Created special offer: ${offer.name}`);
            } else {
                console.log(`Special offer ${offer.name} already exists, skipping`);
            }
        }

        const customers = await Customer.findAll();
        const specialOffers = await SpecialOffer.findAll();

        for (const customer of customers) {
            const existingVouchers = await Voucher.count({ where: { customerId: customer.id } });

            if (existingVouchers === 0) {
                for (const offer of specialOffers) {

                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 30);

                    const voucherCode = generateVoucherCode();

                    await Voucher.create({
                        code: voucherCode,
                        customerId: customer.id as number,
                        specialOfferId: offer.id as number,
                        expirationDate: expirationDate
                    });

                    console.log(`Created voucher ${voucherCode} for customer ID ${customer.id} with offer ${offer.name}`);
                }
            } else {
                console.log(`Customer ID ${customer.id} already has vouchers, skipping`);
            }
        }

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Database seeding failed:', error);
    }
};