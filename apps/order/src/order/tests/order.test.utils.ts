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