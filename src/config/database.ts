import { Sequelize } from 'sequelize';

const dbName = process.env.POSTGRES_DB || 'vouchers';
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || 'postgres';
const dbHost = process.env.POSTGRES_HOST || 'db';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'production',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully');

    // Sync all models
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('Database synchronized');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}