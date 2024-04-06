import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntityDto } from '@app/common';
import { OrderProductsEntity } from './orderProducts.entity';

@Entity({ name: 'order' })
export class OrderEntity extends BaseEntityDto {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  totalPrice: number;

  @OneToMany(()=> OrderProductsEntity, (orderProducts) => orderProducts.order)
  orderProducts: OrderProductsEntity[];
}
