import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

import { AbstractDocument } from '@common/database/abstract.schema';

@Schema({ versionKey: false, collection: 'feeds' })
export class FeedDocument extends AbstractDocument {
  @Expose()
  @ApiProperty({ description: 'feed contents', example: 'sample contents' })
  @IsString()
  @Prop({ required: true })
  content: string;

  @Expose()
  @Prop({ required: true })
  adminId: Types.ObjectId;

  @Prop({ required: true, default: false })
  @Prop()
  isDeleted?: boolean;

  @Expose()
  @Prop({ required: true, default: () => new Date() })
  createdAt?: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedAt?: Date;
}

export const FeedSchema = SchemaFactory.createForClass(FeedDocument);
