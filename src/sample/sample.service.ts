import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { FeedsRepository } from '@schools/repositories/feeds.repository';
import { SchoolsRepository } from '@schools/repositories/schools.repository';
import { feedSampleData } from '@src/sample/data/feed.sample.data';
import { schoolSampleData } from '@src/sample/data/school.sample.data';
import { userSampleData } from '@src/sample/data/user.sample.data';
import { SubscribesRepository } from '@subscribes/subscribes.repository';
import { UsersRepository } from '@users/users.repository';

@Injectable()
export class SampleService {
  private readonly logger = new Logger(SampleService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly schoolsRepository: SchoolsRepository,
    private readonly feedsRepository: FeedsRepository,
    private readonly subscribesRepository: SubscribesRepository,
  ) {}

  /**
   * generate sample data
   * @returns {Promise<void>}
   */
  async insertSampleData(): Promise<void> {
    try {
      const userDocumentCount = await this.usersRepository.estimatedDocumentCount();
      if (userDocumentCount < 1) {
        for (const data of userSampleData) {
          data.password = await bcrypt.hash(data.password, 10);
        }
        await this.usersRepository.saveAll(userSampleData);
      }

      const adminId = await this.usersRepository.findOne({ role: 'admin' }).then((res) => res._id);
      const feedDocumentCount = await this.feedsRepository.estimatedDocumentCount();
      if (feedDocumentCount < 1) {
        feedSampleData.map((data) => (data.adminId = adminId));

        await this.feedsRepository.saveAll(feedSampleData);
      }

      const schoolDocumentCount = await this.schoolsRepository.estimatedDocumentCount();
      if (schoolDocumentCount < 1) {
        const feedList = await this.feedsRepository.find({});
        schoolSampleData.forEach((school) => {
          school.adminId = adminId;
          school.feedList = feedList.filter((feed) => feed.content.includes(school.name));
          this.schoolsRepository.create(school);
        });
      }

      const subscribeDocumentCount = await this.subscribesRepository.estimatedDocumentCount();
      if (subscribeDocumentCount < 1) {
        const student = await this.usersRepository.findOne({ role: 'student' });
        const schoolsList = await this.schoolsRepository.find({});

        schoolsList.forEach((school) => {
          this.subscribesRepository.create({ user: student, school });
        });
      }
    } catch (error) {
      this.logger.error(`failed to generate sample data for assignments`);
      // 에러 발생과 무관하게 프로그램 실행
    }
  }
}
