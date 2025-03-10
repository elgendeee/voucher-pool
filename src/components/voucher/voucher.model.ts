import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import Customer from '../customer/customer.model';
import SpecialOffer from '../special-offer/special-offer.model';

export interface IVoucherAttributes {
    id?: number;
    code: string;
    customerId: number;
    specialOfferId: number;
    expirationDate: Date;
    usedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IVoucherCreationAttributes {
    code: string;
    customerId: number;
    specialOfferId: number;
    expirationDate: Date;
    usedAt?: Date | null;
}

export interface IVoucherInstance extends Model<IVoucherAttributes, IVoucherCreationAttributes>, IVoucherAttributes { }

const Voucher = sequelize.define<IVoucherInstance>(
    'Voucher',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true,
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        specialOfferId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'special_offers',
                key: 'id'
            }
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'vouchers',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['code']
            }
        ]
    }
);

Voucher.belongsTo(Customer, { foreignKey: 'customerId' });
Voucher.belongsTo(SpecialOffer, { foreignKey: 'specialOfferId' });
Customer.hasMany(Voucher, { foreignKey: 'customerId' });
SpecialOffer.hasMany(Voucher, { foreignKey: 'specialOfferId' });

export default Voucher;