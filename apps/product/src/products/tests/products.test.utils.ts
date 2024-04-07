import { ProductEntity } from "../products.entity";
import { faker } from '@faker-js/faker';

export function createRandomData(): ProductEntity {
    const mockProduct = new ProductEntity();
    mockProduct.id = faker.string.uuid();
    mockProduct.name = faker.commerce.productName();
    mockProduct.description = faker.lorem.sentence();
    mockProduct.price = +faker.commerce.price({min: 1, max: 1000});
    mockProduct.stock = faker.number.int(100);
    mockProduct.createdAt = new Date();
    mockProduct.updatedAt = null;
    mockProduct.isArchived = false;
    return mockProduct;
}

export const mockProducts: ProductEntity[] = faker.helpers.multiple(createRandomData, {
    count: 5,
});