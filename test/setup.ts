// Set environment to test
process.env.NODE_ENV = 'test';
process.env.POSTGRES_DB = 'vouchers_test';
process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'postgres';
process.env.POSTGRES_HOST = 'localhost';

// Increase timeout for tests
jest.setTimeout(30000);