import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { AbstractDocument } from '@common/database/abstract.schema';

@Schema({ versionKey: false })
export class FeedDocument extends AbstractDocument {
  @Prop()
  content: string;

  @Prop()
  adminId: Types.ObjectId;

  @Prop()
  is_deleted: boolean;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const FeedSchema = SchemaFactory.createForClass(FeedDocument);
