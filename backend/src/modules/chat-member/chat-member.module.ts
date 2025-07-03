import { Module } from '@nestjs/common';
import { ChatMemberService } from './chat-member.service';
import { ChatMemberController } from './chat-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from 'src/entities/chat-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMember])],
  controllers: [ChatMemberController],
  providers: [ChatMemberService],
  exports: [ChatMemberService],
})
export class ChatMemberModule {}
