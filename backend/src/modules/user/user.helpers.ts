import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, In, IsNull } from 'typeorm';

export class UserWhere {
  email?: string;
  id?: number;
  ids?: number[];
  nickname?: string;
  deletedAt?: Date | null;
}

export const getWhere = (where: UserWhere) => {
  const finalWhere: FindOptionsWhere<User> = {};

  for (const [key, value] of Object.entries(where)) {
    if (key === 'ids') {
      finalWhere.id = In(value);
      continue;
    }
    if (value === null) {
      finalWhere[key] = IsNull();
      continue;
    }

    finalWhere[key] = value;
  }

  return finalWhere;
};
