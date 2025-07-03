import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChatService } from './chat.service';
import { normalizePaginationForDB, validatePaginationInQuery } from 'src/utils';
import { CreateChatDto } from './dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(
    @CurrentUser() user: User,
    @Query('page') pageQuery = 1,
    @Query('limit') limitQuery = 10,
    @Query('search') search = '', // TODO: implement search
  ) {
    const { page, limit } = validatePaginationInQuery({
      page: pageQuery,
      limit: limitQuery,
    });
    const { skip, take } = normalizePaginationForDB({ page, limit });

    const chats = await this.chatService.getUserActiveChats(
      user.id,
      {
        members: {
          user: true,
        },
      },
      skip,
      take,
    );

    const data = chats
      .map((chat) => {
        const name = chat.isGroup
          ? chat.name
          : chat.members.find((member) => member.user.id !== user.id).user.name;

        if (!name) return null;

        // TODO: add message integration to get last message and status
        // TODO: add images of chat

        const messageInfo = {
          lastMessage: 'Bla bla bla',
          status: 'NEW',
        };

        return {
          ...chat,
          name,
          messageInfo,
        };
      })
      .filter(Boolean);

    const total = await this.chatService.getUserActiveChatsCount(user.id);

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
