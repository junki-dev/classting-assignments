import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';

const logger = new Logger('utils');

export const entityToDto = <T, V>(dto: ClassConstructor<T>, entity: V): T => {
  try {
    return {
      ...plainToInstance(dto, convertObjectIdPropsToHexString(entity), {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      }),
    };
  } catch (error) {
    logger.error({ message: `failed to conversion entity to dto`, error: error.message });
    throw new InternalServerErrorException(`failed to conversion entity to dto`);
  }
};

export const entityToDtoArray = <T, V>(dto: ClassConstructor<T>, entity: V[]): T[] => {
  try {
    return plainToInstance(
      dto,
      entity.map((e) => convertObjectIdPropsToHexString(e)),
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: false,
      },
    );
  } catch (error) {
    logger.error({ message: `failed to conversion entity to dto array`, error: error.message });
    throw new InternalServerErrorException(`failed to conversion entity to dto array`);
  }
};

export const convertObjectIdPropsToHexString = <V>(entity: V): V => {
  const objectIdProperties = {} as V;
  for (const [key, value] of Object.entries(entity)) {
    if (value instanceof mongoose.Types.ObjectId) {
      objectIdProperties[key] = value.toHexString();
    } else {
      objectIdProperties[key] = value;
    }
  }
  return objectIdProperties;
};
