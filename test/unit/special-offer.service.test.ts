import { SpecialOfferService } from '../../src/components/special-offer/special-offer.service';
import { SpecialOfferRepository } from '../../src/components/special-offer/special-offer.repository';

// Mock the repository
jest.mock('../../src/components/special-offer/special-offer.repository');

describe('SpecialOfferService', () => {
    let specialOfferService: SpecialOfferService;
    let specialOfferRepositoryMock: jest.Mocked<SpecialOfferRepository>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Get mocked constructor
        const SpecialOfferRepositoryMock = SpecialOfferRepository as jest.MockedClass<typeof SpecialOfferRepository>;

        // Create mock instance
        specialOfferRepositoryMock = new SpecialOfferRepositoryMock() as jest.Mocked<SpecialOfferRepository>;

        // Set up the service with mocked dependencies
        specialOfferService = new SpecialOfferService();

        // Replace the service's repository with our mock
        (specialOfferService as any).specialOfferRepository = specialOfferRepositoryMock;
    });

    describe('getAllSpecialOffers', () => {
        it('should return all special offers', async () => {
            // Arrange
            const mockSpecialOffers = [
                { id: 1, name: 'Summer Sale', discountPercentage: 10, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: 'Winter Discount', discountPercentage: 15, createdAt: new Date(), updatedAt: new Date() }
            ];

            specialOfferRepositoryMock.findAll.mockResolvedValue(mockSpecialOffers);

            // Act
            const result = await specialOfferService.getAllSpecialOffers();

            // Assert
            expect(result).toEqual(mockSpecialOffers);
            expect(specialOfferRepositoryMock.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getSpecialOfferById', () => {
        it('should return a special offer when a valid ID is provided', async () => {
            // Arrange
            const mockSpecialOffer = {
                id: 1,
                name: 'Summer Sale',
                discountPercentage: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            specialOfferRepositoryMock.findById.mockResolvedValue(mockSpecialOffer);

            // Act
            const result = await specialOfferService.getSpecialOfferById(1);

            // Assert
            expect(result).toEqual(mockSpecialOffer);
            expect(specialOfferRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(specialOfferRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });

        it('should return null when an invalid ID is provided', async () => {
            // Arrange
            specialOfferRepositoryMock.findById.mockResolvedValue(null);

            // Act
            const result = await specialOfferService.getSpecialOfferById(999);

            // Assert
            expect(result).toBeNull();
            expect(specialOfferRepositoryMock.findById).toHaveBeenCalledWith(999);
            expect(specialOfferRepositoryMock.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('createSpecialOffer', () => {
        it('should create and return a new special offer', async () => {
            // Arrange
            const createSpecialOfferDto = {
                name: 'New Offer',
                discountPercentage: 20
            };

            const mockCreatedSpecialOffer = {
                id: 3,
                ...createSpecialOfferDto,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            specialOfferRepositoryMock.create.mockResolvedValue(mockCreatedSpecialOffer);

            // Act
            const result = await specialOfferService.createSpecialOffer(createSpecialOfferDto);

            // Assert
            expect(result).toEqual(mockCreatedSpecialOffer);
            expect(specialOfferRepositoryMock.create).toHaveBeenCalledWith(createSpecialOfferDto);
        });
    });

    describe('updateSpecialOffer', () => {
        it('should update and return the special offer if it exists', async () => {
            // Arrange
            const updateSpecialOfferDto = {
                name: 'Updated Offer'
            };

            const existingSpecialOffer = {
                id: 1,
                name: 'Original Offer',
                discountPercentage: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const updatedSpecialOffer = {
                ...existingSpecialOffer,
                name: 'Updated Offer',
                updatedAt: new Date()
            };

            specialOfferRepositoryMock.findById.mockResolvedValue(existingSpecialOffer);
            specialOfferRepositoryMock.update.mockResolvedValue(updatedSpecialOffer);

            // Act
            const result = await specialOfferService.updateSpecialOffer(1, updateSpecialOfferDto);

            // Assert
            expect(result).toEqual(updatedSpecialOffer);
            expect(specialOfferRepositoryMock.findById).toHaveBeenCalledWith(1);
            expect(specialOfferRepositoryMock.update).toHaveBeenCalledWith(1, updateSpecialOfferDto);
        });

        it('should return null if special offer does not exist', async () => {
            // Arrange
            const updateSpecialOfferDto = {
                name: 'Updated Offer'
            };

            specialOfferRepositoryMock.findById.mockResolvedValue(null);

            // Act
            const result = await specialOfferService.updateSpecialOffer(999, updateSpecialOfferDto);

            // Assert
            expect(result).toBeNull();
            expect(specialOfferRepositoryMock.findById).toHaveBeenCalledWith(999);
            expect(specialOfferRepositoryMock.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteSpecialOffer', () => {
        it('should delete the special offer and return true if successful', async () => {
            // Arrange
            specialOfferRepositoryMock.delete.mockResolvedValue(true);

            // Act
            const result = await specialOfferService.deleteSpecialOffer(1);

            // Assert
            expect(result).toBe(true);
            expect(specialOfferRepositoryMock.delete).toHaveBeenCalledWith(1);
        });

        it('should return false if special offer does not exist', async () => {
            // Arrange
            specialOfferRepositoryMock.delete.mockResolvedValue(false);

            // Act
            const result = await specialOfferService.deleteSpecialOffer(999);

            // Assert
            expect(result).toBe(false);
            expect(specialOfferRepositoryMock.delete).toHaveBeenCalledWith(999);
        });
    });
});