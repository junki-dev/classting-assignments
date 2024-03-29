import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from 'class-validator';
import mongoose from 'mongoose';

import { RoleEnum, RoleEnumType } from '@auth/enum/role.enum';
import { AbstractDocument } from '@common/database/abstract.schema';
import { SubscribeDocument } from '@src/subscribes/models/subscribe.schema';

@Schema({ versionKey: false, collection: 'users' })
export class UserDocument extends AbstractDocument {
  @ApiProperty({ description: 'user email address', example: 'sample01@example.com' })
  @IsEmail()
  @Prop()
  email: string;

  @ApiProperty({ description: 'user password', example: 'StrongPwd!1' })
  @IsStrongPassword()
  @Prop()
  password: string;

  @ApiProperty({ description: 'user role', enum: RoleEnum, example: RoleEnum.STUDENT })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  @Prop()
  role: RoleEnumType;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'SubscribeDocument' })
  subscribeList?: SubscribeDocument[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
