import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { AbstractDocument } from '@common/database/abstract.schema';
import { SchoolDocument } from '@schools/models/school.schema';
import { UserDocument } from '@users/models/user.schema';

@Schema({ versionKey: false, collection: 'subscribes' })
export class SubscribeDocument extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocument' })
  user: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SchoolDocument' })
  school: SchoolDocument;

  @Prop({ required: true, default: false })
  @Prop()
  isDeleted?: boolean;

  @Prop({ required: true, default: () => new Date() })
  createdAt?: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedAt?: Date;
}

export const SubscribeSchema = SchemaFactory.createForClass(SubscribeDocument);
