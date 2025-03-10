import { VoucherService } from '../../src/components/voucher/voucher.service';
import { VoucherRepository } from '../../src/components/voucher/voucher.repository';
import { CustomerService } from '../../src/components/customer/customer.service';
import { SpecialOfferService } from '../../src/components/special-offer/special-offer.service';

// Mock the repositories and services
jest.mock('../../src/components/voucher/voucher.repository');
jest.mock('../../src/components/customer/customer.service');
jest.mock('../../src/components/special-offer/special-offer.service');

describe('VoucherService', () => {
    let voucherService: VoucherService;
    let voucherRepositoryMock: jest.Mocked<VoucherRepository>;
    let customerServiceMock: jest.Mocked<CustomerService>;
    let specialOfferServiceMock: jest.Mocked<SpecialOfferService>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Get mocked constructors
        const VoucherRepositoryMock = VoucherRepository as jest.MockedClass<typeof VoucherRepository>;
        const CustomerServiceMock = CustomerService as jest.MockedClass<typeof CustomerService>;
        const SpecialOfferServiceMock = SpecialOfferService as jest.MockedClass<typeof SpecialOfferService>;

        // Create mock instances
        voucherRepositoryMock = new VoucherRepositoryMock() as jest.Mocked<VoucherRepository>;
        customerServiceMock = new CustomerServiceMock() as jest.Mocked<CustomerService>;
        specialOfferServiceMock = new SpecialOfferServiceMock() as jest.Mocked<SpecialOfferService>;

        // Set up the service with mocked dependencies
        voucherService = new VoucherService();

        // Replace the service's repository with our mock
        (voucherService as any).voucherRepository = voucherRepositoryMock;
        (voucherService as any).customerService = customerServiceMock;
        (voucherService as any).specialOfferService = specialOfferServiceMock;
    });

    describe('getAllVouchers', () => {
        it('should return all vouchers', async () => {
            // Arrange
            const mockVouchers = [
                {
                    id: 1,
                    code: 'ABC123',
                    customerId: 1,
                    specialOfferId: 1,
                    expirationDate: new Date(),
                    usedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    code: 'DEF456',
                    customerId: 2,
                    specialOfferId: 1,
                    expirationDate: new Date(),
                    usedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            voucherRepositoryMock.findAll.mockResolvedValue(mockVouchers);

            // Act
            const result = await voucherService.getAllVouchers();

            // Assert
            expect(result).toEqual(mockVouchers);
            expect(voucherRepositoryMock.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getVoucherById', () => {
        it('should return a voucher when a valid ID is provided', async () => {
            // Arrange
            const mockVoucher = {
                id: 1,
                code: 'ABC123',
                customerId: 1,
                specialOfferId: 1,
                expirationDate: new Date(),
                usedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            voucherRepositoryMock.findById.mockResolvedValue(mockVoucher);

            // Act
            const result = await voucherService.getVoucherById(1);

            // Assert
            expect(result).toEqual(mockVoucher);
            expect(voucherRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(voucherRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });

        it('should return null when an invalid ID is provided', async () => {
            // Arrange
            voucherRepositoryMock.findById.mockResolvedValue(null);

            // Act
            const result = await voucherService.getVoucherById(999);

            // Assert
            expect(result).toBeNull();
            expect(voucherRepositoryMock.findById).toHaveBeenCalledWith(999);
            expect(voucherRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('getValidVouchersByEmail', () => {
        it('should return valid vouchers for a customer', async () => {
            // Arrange
            const email = 'test@example.com';
            const mockCustomer = {
                id: 1,
                name: 'Test Customer',
                email,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockVouchers = [
                {
                    id: 1,
                    code: 'ABC123',
                    customerId: 1,
                    specialOfferId: 1,
                    expirationDate: new Date(),
                    usedAt: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    customer: {
                        name: 'Test Customer',
                        email
                    },
                    specialOffer: {
                        name: 'Test Offer',
                        discountPercentage: 10
                    }
                }
            ];

            customerServiceMock.getCustomerByEmail.mockResolvedValue(mockCustomer);
            voucherRepositoryMock.findValidVouchersByEmail.mockResolvedValue(mockVouchers);

            // Act
            const result = await voucherService.getValidVouchersByEmail(email);

            // Assert
            expect(result).toEqual({
                email,
                vouchers: mockVouchers
            });
            expect(customerServiceMock.getCustomerByEmail).toHaveBeenCalledWith(email);
            expect(voucherRepositoryMock.findValidVouchersByEmail).toHaveBeenCalledWith(email);
        });

        it('should throw an error if customer does not exist', async () => {
            // Arrange
            const email = 'nonexistent@example.com';

            customerServiceMock.getCustomerByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(voucherService.getValidVouchersByEmail(email))
                .rejects
                .toThrow('Customer not found');

            expect(customerServiceMock.getCustomerByEmail).toHaveBeenCalledWith(email);
            expect(voucherRepositoryMock.findValidVouchersByEmail).not.toHaveBeenCalled();
        });
    });

    describe('createVoucher', () => {
        it('should create a voucher with generated code if not provided', async () => {
            // Arrange
            const voucherData = {
                customerId: 1,
                specialOfferId: 1,
                expirationDate: new Date(Date.now() + 86400000) // tomorrow
            };

            const mockCustomer = {
                id: 1,
                name: 'Test Customer',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockSpecialOffer = {
                id: 1,
                name: 'Test Offer',
                discountPercentage: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockCreatedVoucher = {
                id: 1,
                code: 'GENERATED123', // Generated code
                customerId: voucherData.customerId,
                specialOfferId: voucherData.specialOfferId,
                expirationDate: voucherData.expirationDate,
                usedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            customerServiceMock.getCustomerById.mockResolvedValue(mockCustomer);
            specialOfferServiceMock.getSpecialOfferById.mockResolvedValue(mockSpecialOffer);
            voucherRepositoryMock.create.mockResolvedValue(mockCreatedVoucher);

            // Mock the private generateVoucherCode method
            jest.spyOn(voucherService as any, 'generateVoucherCode').mockReturnValue('GENERATED123');

            // Act
            const result = await voucherService.createVoucher(voucherData);

            // Assert
            expect(result).toEqual(mockCreatedVoucher);
            expect(customerServiceMock.getCustomerById).toHaveBeenCalledWith(voucherData.customerId);
            expect(specialOfferServiceMock.getSpecialOfferById).toHaveBeenCalledWith(voucherData.specialOfferId);
            expect(voucherRepositoryMock.create).toHaveBeenCalledWith({
                ...voucherData,
                code: 'GENERATED123'
            });
        });

        it('should throw an error if customer does not exist', async () => {
            // Arrange
            const voucherData = {
                customerId: 999,
                specialOfferId: 1,
                expirationDate: new Date(Date.now() + 86400000) // tomorrow
            };

            customerServiceMock.getCustomerById.mockResolvedValue(null);

            // Act & Assert
            await expect(voucherService.createVoucher(voucherData))
                .rejects
                .toThrow('Customer not found');

            expect(customerServiceMock.getCustomerById).toHaveBeenCalledWith(voucherData.customerId);
            expect(specialOfferServiceMock.getSpecialOfferById).not.toHaveBeenCalled();
            expect(voucherRepositoryMock.create).not.toHaveBeenCalled();
        });

        it('should throw an error if special offer does not exist', async () => {
            // Arrange
            const voucherData = {
                customerId: 1,
                specialOfferId: 999,
                expirationDate: new Date(Date.now() + 86400000) // tomorrow
            };

            const mockCustomer = {
                id: 1,
                name: 'Test Customer',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            customerServiceMock.getCustomerById.mockResolvedValue(mockCustomer);
            specialOfferServiceMock.getSpecialOfferById.mockResolvedValue(null);

            // Act & Assert
            await expect(voucherService.createVoucher(voucherData))
                .rejects
                .toThrow('Special offer not found');

            expect(customerServiceMock.getCustomerById).toHaveBeenCalledWith(voucherData.customerId);
            expect(specialOfferServiceMock.getSpecialOfferById).toHaveBeenCalledWith(voucherData.specialOfferId);
            expect(voucherRepositoryMock.create).not.toHaveBeenCalled();
        });
    });

    describe('redeemVoucher', () => {
        it('should successfully redeem a valid voucher', async () => {
            // Arrange
            const redeemData = {
                code: 'ABC123',
                email: 'test@example.com'
            };

            const mockResponse = {
                isValid: true,
                discountPercentage: 10,
                offerName: 'Test Offer'
            };

            voucherRepositoryMock.isVoucherValid.mockResolvedValue(mockResponse);

            // Act
            const result = await voucherService.redeemVoucher(redeemData);

            // Assert
            expect(result).toEqual(mockResponse);
            expect(voucherRepositoryMock.isVoucherValid).toHaveBeenCalledWith(
                redeemData.code,
                redeemData.email
            );
        });

        it('should return invalid response for an invalid voucher', async () => {
            // Arrange
            const redeemData = {
                code: 'INVALID',
                email: 'test@example.com'
            };

            const mockResponse = {
                isValid: false,
                message: 'Voucher not found'
            };

            voucherRepositoryMock.isVoucherValid.mockResolvedValue(mockResponse);

            // Act
            const result = await voucherService.redeemVoucher(redeemData);

            // Assert
            expect(result).toEqual(mockResponse);
            expect(voucherRepositoryMock.isVoucherValid).toHaveBeenCalledWith(
                redeemData.code,
                redeemData.email
            );
        });
    });

    describe('generateVouchers', () => {
        it('should generate vouchers for multiple customers', async () => {
            // Arrange
            const generateData = {
                specialOfferId: 1,
                expirationDate: new Date(Date.now() + 86400000), // tomorrow
                customerIds: [1, 2, 3]
            };

            const mockSpecialOffer = {
                id: 1,
                name: 'Test Offer',
                discountPercentage: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockCustomers = [
                { id: 1, name: 'Customer 1', email: 'customer1@example.com', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: 'Customer 2', email: 'customer2@example.com', createdAt: new Date(), updatedAt: new Date() },
                { id: 3, name: 'Customer 3', email: 'customer3@example.com', createdAt: new Date(), updatedAt: new Date() }
            ];

            const mockGeneratedVouchers = [
                { id: 1, code: 'CODE1', customerId: 1, specialOfferId: 1, expirationDate: generateData.expirationDate, usedAt: null, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, code: 'CODE2', customerId: 2, specialOfferId: 1, expirationDate: generateData.expirationDate, usedAt: null, createdAt: new Date(), updatedAt: new Date() },
                { id: 3, code: 'CODE3', customerId: 3, specialOfferId: 1, expirationDate: generateData.expirationDate, usedAt: null, createdAt: new Date(), updatedAt: new Date() }
            ];

            specialOfferServiceMock.getSpecialOfferById.mockResolvedValue(mockSpecialOffer);

            // Mock customer service to return appropriate customer based on ID
            customerServiceMock.getCustomerById.mockImplementation(async (id) => {
                return mockCustomers.find(c => c.id === id) || null;
            });

            voucherRepositoryMock.createMany.mockResolvedValue(mockGeneratedVouchers);

            // Mock the private generateVoucherCode method
            jest.spyOn(voucherService as any, 'generateVoucherCode')
                .mockReturnValueOnce('CODE1')
                .mockReturnValueOnce('CODE2')
                .mockReturnValueOnce('CODE3');

            // Act
            const result = await voucherService.generateVouchers(generateData);

            // Assert
            expect(result).toEqual(mockGeneratedVouchers);
            expect(specialOfferServiceMock.getSpecialOfferById).toHaveBeenCalledWith(generateData.specialOfferId);
            expect(customerServiceMock.getCustomerById).toHaveBeenCalledTimes(3);
            expect(voucherRepositoryMock.createMany).toHaveBeenCalledWith([
                { customerId: 1, specialOfferId: 1, expirationDate: generateData.expirationDate, code: 'CODE1' },
                { customerId: 2, specialOfferId: 1, expirationDate: generateData.expirationDate, code: 'CODE2' },
                { customerId: 3, specialOfferId: 1, expirationDate: generateData.expirationDate, code: 'CODE3' }
            ]);
        });

        it('should throw an error if special offer does not exist', async () => {
            // Arrange
            const generateData = {
                specialOfferId: 999,
                expirationDate: new Date(Date.now() + 86400000), // tomorrow
                customerIds: [1, 2, 3]
            };

            specialOfferServiceMock.getSpecialOfferById.mockResolvedValue(null);

            // Act & Assert
            await expect(voucherService.generateVouchers(generateData))
                .rejects
                .toThrow('Special offer not found');

            expect(specialOfferServiceMock.getSpecialOfferById).toHaveBeenCalledWith(generateData.specialOfferId);
            expect(customerServiceMock.getCustomerById).not.toHaveBeenCalled();
            expect(voucherRepositoryMock.createMany).not.toHaveBeenCalled();
        });

        it('should throw an error if any customer does not exist', async () => {
            // Arrange
            const generateData = {
                specialOfferId: 1,
                expirationDate: new Date(Date.now() + 86400000), // tomorrow
                customerIds: [1, 999, 3]
            };

            const mockSpecialOffer = {
                id: 1,
                name: 'Test Offer',
                discountPercentage: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            specialOfferServiceMock.getSpecialOfferById.mockResolvedValue(mockSpecialOffer);

            // Return null for customer ID 999
            customerServiceMock.getCustomerById.mockImplementation(async (id) => {
                if (id === 999) return null;
                return { id, name: `Customer ${id}`, email: `customer${id}@example.com`, createdAt: new Date(), updatedAt: new Date() };
            });

            // Act & Assert
            await expect(voucherService.generateVouchers(generateData))
                .rejects
                .toThrow('One or more customers not found');

            expect(specialOfferServiceMock.getSpecialOfferById).toHaveBeenCalledWith(generateData.specialOfferId);
            expect(customerServiceMock.getCustomerById).toHaveBeenCalledTimes(3);
            expect(voucherRepositoryMock.createMany).not.toHaveBeenCalled();
        });
    });
});