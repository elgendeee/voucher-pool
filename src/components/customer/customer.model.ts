import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ICustomerAttributes {
    id?: number;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICustomerInstance extends Model<ICustomerAttributes>, ICustomerAttributes { }

const Customer = sequelize.define<ICustomerInstance>(
    'Customer',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        }
    },
    {
        tableName: 'customers',
        timestamps: true,
    }
);

export default Customer;