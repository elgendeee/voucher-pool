import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ISpecialOfferAttributes {
  id?: number;
  name: string;
  discountPercentage: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISpecialOfferInstance extends Model<ISpecialOfferAttributes>, ISpecialOfferAttributes { }

const SpecialOffer = sequelize.define<ISpecialOfferInstance>(
  'SpecialOffer',
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
    discountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    }
  },
  {
    tableName: 'special_offers',
    timestamps: true,
  }
);

export default SpecialOffer;