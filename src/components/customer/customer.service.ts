import { CustomerRepository } from './customer.repository';
import { ICreateCustomerDto, ICustomerResponseDto } from './interfaces';

export class CustomerService {
    private customerRepository: CustomerRepository;

    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    async getAllCustomers(): Promise<ICustomerResponseDto[]> {
        return this.customerRepository.findAll();
    }

    async getCustomerById(id: number): Promise<ICustomerResponseDto | null> {
        return this.customerRepository.findById(id);
    }

    async getCustomerByEmail(email: string): Promise<ICustomerResponseDto | null> {
        return this.customerRepository.findByEmail(email);
    }

    async createCustomer(customer: ICreateCustomerDto): Promise<ICustomerResponseDto> {
        const existingCustomer = await this.customerRepository.findByEmail(customer.email);
        if (existingCustomer) {
            throw new Error('Customer with this email already exists');
        }

        return this.customerRepository.create(customer);
    }

    async updateCustomer(id: number, customer: Partial<ICreateCustomerDto>): Promise<ICustomerResponseDto | null> {
        const existingCustomer = await this.customerRepository.findById(id);
        if (!existingCustomer) {
            return null;
        }

        if (customer.email && customer.email !== existingCustomer.email) {
            const customerWithEmail = await this.customerRepository.findByEmail(customer.email);
            if (customerWithEmail) {
                throw new Error('Customer with this email already exists');
            }
        }

        return this.customerRepository.update(id, customer);
    }

    async deleteCustomer(id: number): Promise<boolean> {
        return this.customerRepository.delete(id);
    }
}