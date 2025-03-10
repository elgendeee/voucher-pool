export interface ICreateVoucherDto {
    customerId: number;
    specialOfferId: number;
    expirationDate: Date;
    code?: string;
}

export interface IGenerateVouchersDto {
    specialOfferId: number;
    expirationDate: Date;
    customerIds: number[];
}

export interface IRedeemVoucherDto {
    code: string;
    email: string;
}

export interface IVoucherResponseDto {
    id: number;
    code: string;
    customerId: number;
    customerEmail?: string
    specialOfferId: number;
    discountPercentage?: number;
    expirationDate: Date;
    usedAt: Date | null;
    isUsed?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IVoucherWithDetailsDto extends IVoucherResponseDto {
    customer: {
        name: string;
        email: string;
    };
    specialOffer: {
        name: string;
        discountPercentage: number;
    };
}

export interface IRedeemVoucherResponseDto {
    isValid: boolean;
    discountPercentage?: number;
    offerName?: string;
    message?: string;
}

export interface ICustomerVouchersResponseDto {
    email: string;
    vouchers: IVoucherWithDetailsDto[];
}

export interface IVoucherRepository {
    findAll(): Promise<IVoucherResponseDto[]>;
    findById(id: number): Promise<IVoucherResponseDto | null>;
    findByCode(code: string): Promise<IVoucherWithDetailsDto | null>;
    findValidVouchersByEmail(email: string): Promise<IVoucherWithDetailsDto[]>;
    create(voucher: ICreateVoucherDto): Promise<IVoucherResponseDto>;
    createMany(vouchers: ICreateVoucherDto[]): Promise<IVoucherResponseDto[]>;
    markAsUsed(id: number): Promise<IVoucherResponseDto | null>;
    isVoucherValid(code: string, email: string): Promise<IRedeemVoucherResponseDto>;
}