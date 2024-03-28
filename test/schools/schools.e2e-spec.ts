import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { CreateFeedDto } from '@schools/dto/create-feed.dto';
import { CreateSchoolPageDto } from '@schools/dto/create-school-page.dto';
import { UpdateFeedDto } from '@schools/dto/update-feed.dto';
import { SchoolDocument } from '@schools/models/school.schema';
import { FeedsRepository } from '@schools/repositories/feeds.repository';
import { SchoolsRepository } from '@schools/repositories/schools.repository';
import { SchoolsController } from '@schools/schools.controller';
import { SchoolsService } from '@schools/schools.service';
import { mockSchool1FeedDocumentList, mockSchoolDocumentList } from '@test/mocks';

describe('Schools (e2e)', () => {
  let app: INestApplication;
  let schoolsRepository: SchoolsRepository;
  let feedsRepository: FeedsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SchoolsController],
      providers: [
        SchoolsService,
        {
          provide: SchoolsRepository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: FeedsRepository,
          useValue: {
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          // 여기에 원하는 사용자 객체를 직접 주입
          req.user = { _id: '6603e88fad74c24305aa42ca', role: 'admin' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue(() => true)
      .compile();

    app = moduleFixture.createNestApplication();
    schoolsRepository = moduleFixture.get<SchoolsRepository>(SchoolsRepository);
    feedsRepository = moduleFixture.get<FeedsRepository>(FeedsRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /schools', () => {
    describe('성공 시', () => {
      it('200 상태와 school page 목록을 반환합니다.', async () => {
        jest.spyOn(schoolsRepository, 'find').mockResolvedValueOnce(mockSchoolDocumentList);

        const expected = transformedDocument(mockSchoolDocumentList);

        return request(app.getHttpServer()).get('/schools').expect(200).expect(expected);
      });
    });

    describe('실패 시', () => {
      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'find').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).get('/schools').expect(500);
      });
    });
  });

  describe('POST /schools', () => {
    const createSchoolPgeDto: CreateSchoolPageDto = {
      name: 'test school',
      location: 'jeju',
    };

    describe('성공 시', () => {
      it('201 상태를 반환합니다.', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(null);

        return request(app.getHttpServer()).post('/schools').send(createSchoolPgeDto).expect(201);
      });
    });

    describe('실패 시', () => {
      it('이미 같은 학교 이름과 지역이 있는 경우, 309 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(mockSchoolDocumentList[0]);

        return request(app.getHttpServer()).post('/schools').send(createSchoolPgeDto).expect(409);
      });

      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).post('/schools').send(createSchoolPgeDto).expect(500);
      });
    });
  });

  describe('POST /schools/feeds', () => {
    const createFeedDto: CreateFeedDto = {
      content: 'test feed content',
      schoolId: mockSchoolDocumentList[0]._id.toString(),
    };

    describe('성공 시', () => {
      it('201 상태를 반환합니다.', async () => {
        jest.spyOn(feedsRepository, 'create').mockResolvedValueOnce(mockSchool1FeedDocumentList[0]);

        return request(app.getHttpServer()).post('/schools/feeds').send(createFeedDto).expect(201);
      });
    });

    describe('실패 시', () => {
      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(feedsRepository, 'create').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).post('/schools/feeds').send(createFeedDto).expect(500);
      });
    });
  });

  describe('PATCH /schools/feeds/:feedId', () => {
    const updateFeedDto: UpdateFeedDto = {
      content: 'test feed updated content',
    };

    describe('성공 시', () => {
      it('200 상태를 반환합니다.', async () => {
        return request(app.getHttpServer())
          .patch(`/schools/feeds/${mockSchool1FeedDocumentList[0]._id}`)
          .send(updateFeedDto)
          .expect(200);
      });
    });

    describe('실패 시', () => {
      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(feedsRepository, 'findOneAndUpdate').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer())
          .patch(`/schools/feeds/${mockSchool1FeedDocumentList[0]._id}`)
          .send(updateFeedDto)
          .expect(500);
      });
    });
  });

  describe('DELETE /schools/feeds/:feedId', () => {
    describe('성공 시', () => {
      it('200 상태를 반환합니다.', async () => {
        return request(app.getHttpServer()).delete(`/schools/feeds/${mockSchool1FeedDocumentList[0]._id}`).expect(200);
      });
    });

    describe('실패 시', () => {
      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(feedsRepository, 'findOneAndUpdate').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).delete(`/schools/feeds/${mockSchool1FeedDocumentList[0]._id}`).expect(500);
      });
    });
  });
});

function transformedDocument(schoolDocumentList: SchoolDocument[]) {
  const expected = [];
  schoolDocumentList.forEach((schoolDocument) => {
    const expectedFeed = schoolDocument.feedList.map((feed) => {
      return {
        ...feed,
        _id: feed._id.toString(),
        adminId: feed.adminId.toString(),
        createdAt: feed.createdAt.toISOString(),
        updatedAt: feed.updatedAt.toISOString(),
      };
    });
    expected.push({
      ...schoolDocument,
      _id: schoolDocument._id.toString(),
      adminId: schoolDocument.adminId.toString(),
      createdAt: schoolDocument.createdAt.toISOString(),
      feedList: expectedFeed,
    });
  });

  return expected;
}
