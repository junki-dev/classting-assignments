import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { AbstractDocument } from './abstract.schema';
import { PaginationDto } from '../dto/pagination.dto';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  async saveAll(documents: Array<Omit<Partial<TDocument>, '_id'>>) {
    const createDocuments = await Promise.all(
      documents.map((document) => new this.model({ ...document, _id: new Types.ObjectId() })),
    );

    await this.model.insertMany(createDocuments);
  }

  async findOne(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOne(filterQuery, {}, { lean: true }); // { lean: true } : mongoDB document 가 아닌 javascript object를 반환함
  }

  async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });
    if (!document) {
      this.logger.warn(`Document not found with filterQuery`, filterQuery);
      throw new NotFoundException(`Document not found.`);
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findWithPagination(filterQuery: FilterQuery<TDocument>, paginationDto: PaginationDto<TDocument>) {
    const sortQuery: { [key: string]: 'asc' | 'desc' } = {};
    sortQuery[paginationDto.sortField.toString()] = paginationDto.sortOrder;

    return this.model
      .find(filterQuery, {}, { lean: true })
      .sort(sortQuery)
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .limit(paginationDto.limit);
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOneAndDelete(filterQuery, { lean: true });
  }
}
