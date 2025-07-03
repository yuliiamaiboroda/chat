import { FindOptionsWhere, IsNull } from 'typeorm';
import {
  ChatMemberWhere,
  getChatMemberWhere,
} from '../chat-member/chat-member.helper';
import { Chat } from 'src/entities/chat.entity';

export class ChatWhere {
  id?: number;
  name?: string;
  isPrivate?: boolean;
  isGroup?: boolean;
  members?: ChatMemberWhere[];
}

export const getChatWhere = (where: ChatWhere): FindOptionsWhere<Chat> => {
  const finalWhere: FindOptionsWhere<Chat> = {};

  for (const [key, value] of Object.entries(where)) {
    if (key === 'members') {
      finalWhere.members = getChatMemberWhere(value);
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
