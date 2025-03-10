export interface ICreateCustomerDto {
    name: string;
    email: string;
}

export interface ICustomerResponseDto {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICustomerRepository {
    findAll(): Promise<ICustomerResponseDto[]>;
    findById(id: number): Promise<ICustomerResponseDto | null>;
    findByEmail(email: string): Promise<ICustomerResponseDto | null>;
    create(customer: ICreateCustomerDto): Promise<ICustomerResponseDto>;
    update(id: number, customer: Partial<ICreateCustomerDto>): Promise<ICustomerResponseDto | null>;
    delete(id: number): Promise<boolean>;
}