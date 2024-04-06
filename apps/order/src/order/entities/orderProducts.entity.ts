import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntityDto } from '@app/common';
import { OrderEntity } from './order.entity';

@Entity({ name: 'orderProducts' })
export class OrderProductsEntity extends BaseEntityDto {
  @Column({ type: 'varchar' })
  productId: string;

  @Column({ type: 'integer'})
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderProducts)
  order: OrderEntity
}
