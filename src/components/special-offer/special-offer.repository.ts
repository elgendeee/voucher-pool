import SpecialOffer from './special-offer.model';
import { ICreateSpecialOfferDto, ISpecialOfferRepository, ISpecialOfferResponseDto } from './interfaces';

export class SpecialOfferRepository implements ISpecialOfferRepository {
    async findAll(): Promise<ISpecialOfferResponseDto[]> {
        const specialOffers = await SpecialOffer.findAll();
        return specialOffers.map(offer => offer.toJSON() as ISpecialOfferResponseDto);
    }

    async findById(id: number): Promise<ISpecialOfferResponseDto | null> {
        const specialOffer = await SpecialOffer.findByPk(id);
        return specialOffer ? specialOffer.toJSON() as ISpecialOfferResponseDto : null;
    }

    async create(specialOfferData: ICreateSpecialOfferDto): Promise<ISpecialOfferResponseDto> {
        const specialOffer = await SpecialOffer.create(specialOfferData);
        return specialOffer.toJSON() as ISpecialOfferResponseDto;
    }

    async update(id: number, specialOfferData: Partial<ICreateSpecialOfferDto>): Promise<ISpecialOfferResponseDto | null> {
        const [updated] = await SpecialOffer.update(specialOfferData, {
            where: { id },
            returning: true
        });

        if (updated === 0) {
            return null;
        }

        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const deleted = await SpecialOffer.destroy({
            where: { id }
        });

        return deleted > 0;
    }
}