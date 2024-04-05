import { Entity, Column } from 'typeorm';
import { BaseEntityDto } from '@app/common';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntityDto {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'integer' })
  stock: number;
}
