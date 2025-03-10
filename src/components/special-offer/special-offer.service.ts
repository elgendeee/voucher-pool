import { SpecialOfferRepository } from './special-offer.repository';
import { ICreateSpecialOfferDto, ISpecialOfferResponseDto } from './interfaces';

export class SpecialOfferService {
    private specialOfferRepository: SpecialOfferRepository;

    constructor() {
        this.specialOfferRepository = new SpecialOfferRepository();
    }

    async getAllSpecialOffers(): Promise<ISpecialOfferResponseDto[]> {
        return this.specialOfferRepository.findAll();
    }

    async getSpecialOfferById(id: number): Promise<ISpecialOfferResponseDto | null> {
        return this.specialOfferRepository.findById(id);
    }

    async createSpecialOffer(specialOffer: ICreateSpecialOfferDto): Promise<ISpecialOfferResponseDto> {
        return this.specialOfferRepository.create(specialOffer);
    }

    async updateSpecialOffer(id: number, specialOffer: Partial<ICreateSpecialOfferDto>): Promise<ISpecialOfferResponseDto | null> {
        const existingSpecialOffer = await this.specialOfferRepository.findById(id);
        if (!existingSpecialOffer) {
            return null;
        }

        return this.specialOfferRepository.update(id, specialOffer);
    }

    async deleteSpecialOffer(id: number): Promise<boolean> {
        return this.specialOfferRepository.delete(id);
    }
}