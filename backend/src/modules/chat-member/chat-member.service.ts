import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMember } from 'src/entities/chat-member.entity';
import { DeepPartial, FindOptionsRelations, Repository } from 'typeorm';

@Injectable()
export class ChatMemberService {
  constructor(
    @InjectRepository(ChatMember)
    private readonly repository: Repository<ChatMember>,
  ) {}

  async createChatMember(member: DeepPartial<ChatMember>): Promise<ChatMember> {
    const entity = this.repository.create(member);
    await this.repository.save(entity);

    return entity;
  }

  async updateChatMember(
    id: number,
    member: DeepPartial<ChatMember>,
  ): Promise<ChatMember> {
    const chatMember = await this.repository.findOne({
      where: { id },
    });
    if (!chatMember) return null;

    Object.assign(chatMember, member);
    return this.repository.save(chatMember);
  }

  async deleteChatMember(userId: number, chatId: number): Promise<ChatMember> {
    const chatMember = await this.repository.findOne({
      where: { userId, chatId },
    });
    if (!chatMember) return null;

    await this.repository.delete({ userId, chatId });
    return chatMember;
  }

  async getChatMembers(
    chatId: number,
    relations: FindOptionsRelations<ChatMember>,
    skip?: number,
    take?: number,
  ): Promise<ChatMember[]> {
    return await this.repository.find({
      where: { chatId },
      relations,
      skip,
      take,
    });
  }
}
