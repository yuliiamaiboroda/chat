import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({
    name: 'name',
    type: 'text',
  })
  name: string;

  @ApiProperty({ type: String })
  @Column({
    name: 'nickname',
    type: 'text',
  })
  nickname: string;

  @ApiProperty({ type: String })
  @Column({
    name: 'email',
    type: 'text',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'text',
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
