import { Prop, Schema } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Expose()
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
