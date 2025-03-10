export interface ICreateSpecialOfferDto {
    name: string;
    discountPercentage: number;
}

export interface ISpecialOfferResponseDto {
    id: number;
    name: string;
    discountPercentage: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISpecialOfferRepository {
    findAll(): Promise<ISpecialOfferResponseDto[]>;
    findById(id: number): Promise<ISpecialOfferResponseDto | null>;
    create(specialOffer: ICreateSpecialOfferDto): Promise<ISpecialOfferResponseDto>;
    update(id: number, specialOffer: Partial<ICreateSpecialOfferDto>): Promise<ISpecialOfferResponseDto | null>;
    delete(id: number): Promise<boolean>;
}