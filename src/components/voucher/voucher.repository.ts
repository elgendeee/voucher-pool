import { Op, Transaction } from 'sequelize';
import { sequelize } from '../../config/database';
import Voucher, { IVoucherCreationAttributes } from './voucher.model';
import Customer from '../customer/customer.model';
import SpecialOffer from '../special-offer/special-offer.model';
import {
    ICreateVoucherDto,
    IVoucherRepository,
    IVoucherResponseDto,
    IVoucherWithDetailsDto,
    IRedeemVoucherResponseDto
} from './interfaces';

export class VoucherRepository implements IVoucherRepository {
    async findAll(): Promise<IVoucherResponseDto[]> {
        // include email of the customer and sort by updatedAt
        const vouchers = await Voucher.findAll({
            include: [
            { model: Customer, attributes: ['email'] }
            ],
            order: [['updatedAt', 'DESC']]
        });
        return vouchers.map(voucher => {
            const voucherJson = voucher.toJSON() as any;
            return {
            ...voucherJson,
            isUsed: !!voucherJson.usedAt
            } as IVoucherResponseDto;
        });
    }

    async findById(id: number): Promise<IVoucherResponseDto | null> {
        // include email of the customer and name of the special offer with the discount percentage
        const voucher = await Voucher.findByPk(id, {
            include: [
                { model: Customer, attributes: ['email'] },
                { model: SpecialOffer, attributes: ['name', 'discountPercentage'] }
            ]
        });
        if (!voucher) {
            return null;
        }

        const voucherJson = voucher.toJSON() as any;
        return {
            ...voucherJson,
            isUsed: !!voucherJson.usedAt
        } as IVoucherResponseDto;
    }

    async findByCode(code: string): Promise<IVoucherWithDetailsDto | null> {
        const voucher = await Voucher.findOne({
            where: { code },
            include: [
                { model: Customer, attributes: ['email'] },
                { model: SpecialOffer, attributes: ['name', 'discountPercentage'] }
            ]
        });

        if (!voucher) {
            return null;
        }

        const voucherJson = voucher.toJSON() as any;
        return {
            ...voucherJson,
            isUsed: !!voucherJson.usedAt
        } as IVoucherWithDetailsDto;
    }

    async findValidVouchersByEmail(email: string): Promise<IVoucherWithDetailsDto[]> {
        const vouchers = await Voucher.findAll({
            include: [
                {
                    model: Customer,
                    where: { email },
                    attributes: []
                },
                {
                    model: SpecialOffer,
                    attributes: ['name', 'discountPercentage']
                }
            ],
            where: {
                expirationDate: {
                    [Op.gt]: new Date()
                }
            }
        });

        return vouchers.map(voucher => {
            const voucherJson = voucher.toJSON() as any;
            return {
                ...voucherJson,
                isUsed: !!voucherJson.usedAt
            } as IVoucherWithDetailsDto;
        });
    }

    async create(voucherData: ICreateVoucherDto): Promise<IVoucherResponseDto> {
        // Ensure code is present before creating
        if (!voucherData.code) {
            throw new Error('Voucher code is required');
        }

        // Create the voucher with explicit type casting
        const voucherAttributes: IVoucherCreationAttributes = {
            code: voucherData.code,
            customerId: voucherData.customerId,
            specialOfferId: voucherData.specialOfferId,
            expirationDate: voucherData.expirationDate
        };

        const voucher = await Voucher.create(voucherAttributes);
        return voucher.toJSON() as IVoucherResponseDto;
    }

    async createMany(vouchersData: ICreateVoucherDto[]): Promise<IVoucherResponseDto[]> {
        const transaction = await sequelize.transaction();
        try {
            // Ensure all vouchers have codes
            const voucherAttributes: IVoucherCreationAttributes[] = vouchersData.map(vData => {
                if (!vData.code) {
                    throw new Error('Voucher code is required for all vouchers');
                }

                return {
                    code: vData.code,
                    customerId: vData.customerId,
                    specialOfferId: vData.specialOfferId,
                    expirationDate: vData.expirationDate
                };
            });

            const vouchers = await Voucher.bulkCreate(voucherAttributes, { transaction });
            await transaction.commit();
            return vouchers.map(voucher => voucher.toJSON() as IVoucherResponseDto);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async markAsUsed(id: number, transaction?: Transaction): Promise<IVoucherResponseDto | null> {
        const options = {
            where: { id },
            returning: true
        };

        if (transaction) {
            Object.assign(options, { transaction });
        }

        const [updated] = await Voucher.update(
            { usedAt: new Date() },
            options
        );

        if (updated === 0) {
            return null;
        }

        return this.findById(id);
    }

    async isVoucherValid(code: string, email: string): Promise<IRedeemVoucherResponseDto> {
        const transaction = await sequelize.transaction();

        try {
            const voucher = await Voucher.findOne({
                where: { code },
                include: [
                    {
                        model: Customer,
                        attributes: ['email']
                    },
                    {
                        model: SpecialOffer,
                        attributes: ['name', 'discountPercentage']
                    }
                ],
                transaction
            });

            if (!voucher) {
                await transaction.rollback();
                return { isValid: false, message: 'Voucher not found' };
            }

            const voucherJson = voucher.toJSON() as any;

            if (voucherJson.Customer.email !== email) {
                await transaction.rollback();
                return { isValid: false, message: 'Voucher does not belong to this customer' };
            }

            if (voucher.usedAt) {
                await transaction.rollback();
                return { isValid: false, message: 'Voucher has already been used' };
            }

            if (new Date(voucher.expirationDate) < new Date()) {
                await transaction.rollback();
                return { isValid: false, message: 'Voucher has expired' };
            }

            // Mark voucher as used
            await voucher.update({ usedAt: new Date() }, { transaction });

            await transaction.commit();

            return {
                isValid: true,
                discountPercentage: voucherJson.SpecialOffer.discountPercentage,
                offerName: voucherJson.SpecialOffer.name
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}