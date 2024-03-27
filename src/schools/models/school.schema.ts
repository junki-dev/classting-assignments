import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

import { AbstractDocument } from '@common/database/abstract.schema';
import { FeedDocument } from '@schools/models/feed.schema';

@Schema({ versionKey: false })
export class SchoolDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  location: string;

  @Prop()
  adminId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FeedDocument' })
  feed: FeedDocument;

  @Prop()
  createdAt: string;
}

export const SchoolSchema = SchemaFactory.createForClass(SchoolDocument);
