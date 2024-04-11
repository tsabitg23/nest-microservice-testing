import { faker } from '@faker-js/faker';
import { OrderEntity } from '../entities/order.entity';

export function createRandomData(): OrderEntity {
    const mockOrder = new OrderEntity();
    mockOrder.id = faker.string.uuid();
    mockOrder.userId = faker.string.uuid();
    mockOrder.totalPrice = faker.number.int(1000);
    return mockOrder;
}

export const mockOrders: OrderEntity[] = faker.helpers.multiple(createRandomData, {
    count: 5,
});


export const mockProducts = [
    {
        id: 'a04931e5-b598-406f-8d71-0c8e859ae3a8',
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 100, max: 1000 }),
        stock: 10,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    }
]