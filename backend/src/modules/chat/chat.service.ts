import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { DeepPartial, FindOptionsRelations, Repository } from 'typeorm';
import { ChatWhere, getChatWhere } from './chat.helper';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly repository: Repository<Chat>,
  ) {}

  async createChat(chat: DeepPartial<Chat>): Promise<Chat> {
    const entity = this.repository.create(chat);
    await this.repository.save(entity);

    return entity;
  }

  async deleteChat(chatId: number): Promise<Chat> {
    const chat = await this.repository.findOne({ where: { id: chatId } });
    if (!chat) return null;

    await this.repository.delete({ id: chatId });
    return chat;
  }

  async updateChat(id: number, chat: DeepPartial<Chat>): Promise<Chat> {
    const chatEntity = await this.repository.findOne({ where: { id } });
    if (!chatEntity) return null;

    Object.assign(chatEntity, chat);
    return this.repository.save(chatEntity);
  }

  async getChat(
    where: ChatWhere,
    relations?: FindOptionsRelations<Chat>,
  ): Promise<Chat> {
    return await this.repository.findOne({
      where: getChatWhere(where),
      relations,
    });
  }

  async getUserActiveChats(
    userId: number,
    relations?: FindOptionsRelations<Chat>,
    skip?: number,
    take?: number,
  ): Promise<Chat[]> {
    return await this.repository.find({
      where: {
        members: {
          userId,
          isBanned: false,
        },
      },
      relations,
      skip,
      take,
    });
  }

  async getUserActiveChatsCount(userId: number): Promise<number> {
    return await this.repository.count({
      where: {
        members: {
          userId,
          isBanned: false,
        },
      },
    });
  }
}
