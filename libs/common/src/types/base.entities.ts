import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsString, IsUUID } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntityDto {
  @ApiProperty({ example: 'bbc16ea5-5a52-46fc-82b2-ed8aee0abc77' })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Column()
  isActive: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Column()
  isArchived: boolean;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDateTime: Date;

  @ApiProperty({ example: 'system' })
  @IsString()
  @Column({ type: 'varchar', default: 'system' })
  createdBy: string;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  lastChangedDateTime: Date;

  @ApiProperty({ example: null })
  @IsString()
  lastChangedBy?: string | null;

  @ApiProperty({ example: null })
  @IsString()
  internalComment?: string | null;
}
