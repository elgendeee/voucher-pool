import Customer from './customer.model';
import { ICreateCustomerDto, ICustomerRepository, ICustomerResponseDto } from './interfaces';

export class CustomerRepository implements ICustomerRepository {
    async findAll(): Promise<ICustomerResponseDto[]> {
        const customers = await Customer.findAll();
        return customers.map(customer => customer.toJSON() as ICustomerResponseDto);
    }

    async findById(id: number): Promise<ICustomerResponseDto | null> {
        const customer = await Customer.findByPk(id);
        return customer ? customer.toJSON() as ICustomerResponseDto : null;
    }

    async findByEmail(email: string): Promise<ICustomerResponseDto | null> {
        const customer = await Customer.findOne({ where: { email } });
        return customer ? customer.toJSON() as ICustomerResponseDto : null;
    }

    async create(customerData: ICreateCustomerDto): Promise<ICustomerResponseDto> {
        const customer = await Customer.create(customerData);
        return customer.toJSON() as ICustomerResponseDto;
    }

    async update(id: number, customerData: Partial<ICreateCustomerDto>): Promise<ICustomerResponseDto | null> {
        const [updated] = await Customer.update(customerData, {
            where: { id },
            returning: true
        });

        if (updated === 0) {
            return null;
        }

        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const deleted = await Customer.destroy({
            where: { id }
        });

        return deleted > 0;
    }
}