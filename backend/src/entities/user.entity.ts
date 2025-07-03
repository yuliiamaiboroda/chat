import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMember } from './chat-member.entity';

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

  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chatMembers: ChatMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
