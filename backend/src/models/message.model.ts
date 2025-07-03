import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Message {
  @Prop({ required: true })
  authorId: number;

  @Prop({
    required: false,
    default: null,
    ref: 'Message',
    type: mongoose.Schema.Types.ObjectId,
  })
  parentId?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  socketId: string;

  @Prop({ required: true })
  chatId: number;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false, default: null })
  updatedAt?: Date;

  @Prop([Number])
  deletedBy: number[];

  @Prop([Number])
  readBy: number[];

  @Prop({ required: false, default: null })
  deletedAt?: Date | null;
}

export const UserSessionSchema = SchemaFactory.createForClass(Message);
