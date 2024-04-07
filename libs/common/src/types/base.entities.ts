import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsUUID } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntityDto {
  @ApiProperty({ example: 'bbc16ea5-5a52-46fc-82b2-ed8aee0abc77' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Column({ default: false})
  isArchived: boolean;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  @Column({
    type: 'timestamp with time zone',
    default: null
  })
  updatedAt: Date;
}
