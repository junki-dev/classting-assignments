import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { CreateFeedDto } from '@schools/dto/create-feed.dto';
import { CreateSchoolPageDto } from '@schools/dto/create-school-page.dto';
import { UpdateFeedDto } from '@schools/dto/update-feed.dto';
import { SchoolDocument } from '@schools/models/school.schema';
import { FeedsRepository } from '@schools/repositories/feeds.repository';
import { SchoolsRepository } from '@schools/repositories/schools.repository';

@Injectable()
export class SchoolsService {
  private readonly logger = new Logger(SchoolsService.name);
  constructor(
    private readonly schoolsRepository: SchoolsRepository,
    private readonly feedsRepository: FeedsRepository,
  ) {}

  /**
   * get all schools page
   * @returns {Promise<SchoolDocument[]>} school page list
   */
  getAllSchools(): Promise<SchoolDocument[]> {
    return this.schoolsRepository.find(
      {},
      { createdAt: 'desc' },
      { path: 'feedList', match: { isDeleted: false }, options: { sort: { createdAt: 'desc' } } },
    );
  }

  /**
   * create school page
   * @param {CreateSchoolPageDto} createSchoolDto create school page dto
   * @returns {Promise<void>}
   */
  async createSchoolPage(createSchoolDto: CreateSchoolPageDto): Promise<void> {
    const school = await this.schoolsRepository.findOne({
      name: createSchoolDto.name,
      location: createSchoolDto.location,
    });
    if (school) {
      this.logger.error(
        `the name of the school that already exists, name=${createSchoolDto.name} location=${createSchoolDto.location}`,
      );
      throw new ConflictException(
        `the name of the school that already exists, name=${createSchoolDto.name} location=${createSchoolDto.location}`,
      );
    }

    await this.schoolsRepository.create({
      name: createSchoolDto.name,
      location: createSchoolDto.location,
      adminId: createSchoolDto.adminId,
    });
  }

  /**
   * create feed within school page
   * @param {CreateFeedDto} createFeedDto create feed dto
   * @returns {Promise<void>}
   */
  async createFeed(createFeedDto: CreateFeedDto): Promise<void> {
    const feed = await this.feedsRepository.create({ content: createFeedDto.content, adminId: createFeedDto.adminId });

    await this.schoolsRepository.findOneAndUpdate({ _id: createFeedDto.schoolId }, { $push: { feedList: feed._id } });
  }

  /**
   * update feed by id
   * @param {string} _id                  feed id
   * @param {UpdateFeedDto} updateFeedDto update feed dto
   * @returns {Promise<void>}
   */
  async updateFeed(_id: string, updateFeedDto: UpdateFeedDto): Promise<void> {
    updateFeedDto.updatedAt = new Date();

    await this.feedsRepository.findOneAndUpdate({ _id }, { $set: updateFeedDto });
  }

  /**
   * delete feed(update delete state)
   * @param {string} _id feed id
   * @returns {Promise<void>}
   */
  async deleteFeed(_id: string): Promise<void> {
    await this.feedsRepository.findOneAndUpdate({ _id }, { $set: { isDeleted: true } });
  }
}
