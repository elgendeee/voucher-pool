import { CustomerService } from '../../src/components/customer/customer.service';
import { CustomerRepository } from '../../src/components/customer/customer.repository';

// Mock the repository
jest.mock('../../src/components/customer/customer.repository');

describe('CustomerService', () => {
    let customerService: CustomerService;
    let customerRepositoryMock: jest.Mocked<CustomerRepository>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Get mocked constructor
        const CustomerRepositoryMock = CustomerRepository as jest.MockedClass<typeof CustomerRepository>;

        // Create mock instance
        customerRepositoryMock = new CustomerRepositoryMock() as jest.Mocked<CustomerRepository>;

        // Set up the service with mocked dependencies
        customerService = new CustomerService();

        // Replace the service's repository with our mock
        (customerService as any).customerRepository = customerRepositoryMock;
    });

    describe('getAllCustomers', () => {
        it('should return all customers', async () => {
            // Arrange
            const mockCustomers = [
                { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() }
            ];

            customerRepositoryMock.findAll.mockResolvedValue(mockCustomers);

            // Act
            const result = await customerService.getAllCustomers();

            // Assert
            expect(result).toEqual(mockCustomers);
            expect(customerRepositoryMock.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCustomerById', () => {
        it('should return a customer when a valid ID is provided', async () => {
            // Arrange
            const mockCustomer = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            customerRepositoryMock.findById.mockResolvedValue(mockCustomer);

            // Act
            const result = await customerService.getCustomerById(1);

            // Assert
            expect(result).toEqual(mockCustomer);
            expect(customerRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });

        it('should return null when an invalid ID is provided', async () => {
            // Arrange
            customerRepositoryMock.findById.mockResolvedValue(null);

            // Act
            const result = await customerService.getCustomerById(999);

            // Assert
            expect(result).toBeNull();
            expect(customerRepositoryMock.findById).toHaveBeenCalledWith(999);
            expect(customerRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('createCustomer', () => {
        it('should create and return a new customer', async () => {
            // Arrange
            const ICreateCustomerDto = {
                name: 'New User',
                email: 'new@example.com'
            };

            const mockCreatedCustomer = {
                id: 3,
                ...ICreateCustomerDto,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            customerRepositoryMock.findByEmail.mockResolvedValue(null);
            customerRepositoryMock.create.mockResolvedValue(mockCreatedCustomer);

            // Act
            const result = await customerService.createCustomer(ICreateCustomerDto);

            // Assert
            expect(result).toEqual(mockCreatedCustomer);
            expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(ICreateCustomerDto.email);
            expect(customerRepositoryMock.create).toHaveBeenCalledWith(ICreateCustomerDto);
        });

        it('should throw an error if customer with email already exists', async () => {
            // Arrange
            const ICreateCustomerDto = {
                name: 'Existing User',
                email: 'existing@example.com'
            };

            const existingCustomer = {
                id: 4,
                name: 'Existing User Original',
                email: 'existing@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            customerRepositoryMock.findByEmail.mockResolvedValue(existingCustomer);

            // Act & Assert
            await expect(customerService.createCustomer(ICreateCustomerDto))
                .rejects
                .toThrow('Customer with this email already exists');

            expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(ICreateCustomerDto.email);
            expect(customerRepositoryMock.create).not.toHaveBeenCalled();
        });
    });

    describe('updateCustomer', () => {
        it('should update and return the customer if it exists', async () => {
            // Arrange
            const updateCustomerDto = {
                name: 'Updated Name'
            };

            const existingCustomer = {
                id: 1,
                name: 'Original Name',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const updatedCustomer = {
                ...existingCustomer,
                name: 'Updated Name',
                updatedAt: new Date()
            };

            customerRepositoryMock.findById.mockResolvedValue(existingCustomer);
            customerRepositoryMock.update.mockResolvedValue(updatedCustomer);

            // Act
            const result = await customerService.updateCustomer(1, updateCustomerDto);

            // Assert
            expect(result).toEqual(updatedCustomer);
            expect(customerRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(customerRepositoryMock.update).toHaveBeenCalledWith(1, updateCustomerDto);
        });

        it('should return null if customer does not exist', async () => {
            // Arrange
            const updateCustomerDto = {
                name: 'Updated Name'
            };

            customerRepositoryMock.findById.mockResolvedValue(null);

            // Act
            const result = await customerService.updateCustomer(999, updateCustomerDto);

            // Assert
            expect(result).toBeNull();
            expect(customerRepositoryMock.findById).toHaveBeenCalledWith(999);
            expect(customerRepositoryMock.update).not.toHaveBeenCalled();
        });

        it('should throw an error if updating email to one that already exists', async () => {
            // Arrange
            const updateCustomerDto = {
                email: 'existing@example.com'
            };

            const existingCustomer = {
                id: 1,
                name: 'Original Name',
                email: 'original@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const customerWithEmail = {
                id: 2,
                name: 'Another User',
                email: 'existing@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            customerRepositoryMock.findById.mockResolvedValue(existingCustomer);
            customerRepositoryMock.findByEmail.mockResolvedValue(customerWithEmail);

            // Act & Assert
            await expect(customerService.updateCustomer(1, updateCustomerDto))
                .rejects
                .toThrow('Customer with this email already exists');

            expect(customerRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(customerRepositoryMock.findByEmail).toHaveBeenCalledWith(updateCustomerDto.email);
            expect(customerRepositoryMock.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteCustomer', () => {
        it('should delete the customer and return true if successful', async () => {
            // Arrange
            customerRepositoryMock.delete.mockResolvedValue(true);

            // Act
            const result = await customerService.deleteCustomer(1);

            // Assert
            expect(result).toBe(true);
            expect(customerRepositoryMock.delete).toHaveBeenCalledWith(1);
        });

        it('should return false if customer does not exist', async () => {
            // Arrange
            customerRepositoryMock.delete.mockResolvedValue(false);

            // Act
            const result = await customerService.deleteCustomer(999);

            // Assert
            expect(result).toBe(false);
            expect(customerRepositoryMock.delete).toHaveBeenCalledWith(999);
        });
    });
});