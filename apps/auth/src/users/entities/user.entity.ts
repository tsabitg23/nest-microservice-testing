import { Entity, Column, Index } from 'typeorm';
import { BaseEntityDto, UserRole } from '@app/common';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityDto {
  @Column({ type: 'varchar' })
  @Index({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar'})
  salt: string;

  @Column({ type: 'varchar' })
  role: string;
}
