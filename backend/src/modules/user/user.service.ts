import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  Repository,
} from 'typeorm';

import { User } from 'src/entities/user.entity';

import { getWhere, UserWhere } from './user.helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: DeepPartial<User>): Promise<User> {
    const entity = this.userRepository.create(user);
    await this.userRepository.save(entity);

    return entity;
  }

  async update(id: number, user: DeepPartial<User>): Promise<User> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) return null;

    Object.assign(userEntity, user);
    return this.userRepository.save(userEntity);
  }

  async softDelete(id: number): Promise<User> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) return null;

    await this.userRepository.softDelete(userEntity);
    return userEntity;
  }

  async delete(id: number): Promise<User> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) return null;

    await this.userRepository.delete(userEntity);
    return userEntity;
  }

  async getOne(
    where: UserWhere,
    withDeleted = false,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.userRepository.findOne({
      where: getWhere(where),
      relations,
      withDeleted,
    });
  }

  async getMany(
    where: UserWhere,
    withDeleted = false,
    relations?: FindOptionsRelations<User>,
    order?: FindOptionsOrder<User>,
    skip?: number,
    take?: number,
  ): Promise<User[]> {
    return this.userRepository.find({
      withDeleted,
      where: getWhere(where),
      relations,
      order,
      skip,
      take,
    });
  }

  async count(where: UserWhere): Promise<number> {
    return this.userRepository.count({ where: getWhere(where) });
  }
}
