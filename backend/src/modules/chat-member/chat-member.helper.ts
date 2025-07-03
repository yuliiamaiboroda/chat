import { FindOptionsWhere, In, IsNull } from 'typeorm';
import { ChatMember } from 'src/entities/chat-member.entity';

export class ChatMemberWhere {
  id?: number;
  ids?: number[];
  userId?: number;
  chatId?: number;
  isAdmin?: boolean;
  isBanned?: boolean;
  isMuted?: boolean;
}

export const getChatMemberWhere = (
  where: ChatMemberWhere,
): FindOptionsWhere<ChatMember> => {
  const finalWhere: FindOptionsWhere<ChatMember> = {};

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
