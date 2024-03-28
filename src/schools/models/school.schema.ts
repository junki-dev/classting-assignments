import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';

import { AbstractDocument } from '@common/database/abstract.schema';
import { FeedDocument } from '@schools/models/feed.schema';

@Schema({ versionKey: false })
export class SchoolDocument extends AbstractDocument {
  @ApiProperty({ description: 'school name', example: 'classting' })
  @IsString()
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'school location', example: 'seoul' })
  @IsString()
  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  adminId: Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'FeedDocument' })
  feedList?: FeedDocument[];

  @Prop({ required: true, default: () => new Date() })
  createdAt?: Date;
}

export const SchoolSchema = SchemaFactory.createForClass(SchoolDocument);
