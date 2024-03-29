import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import * as request from 'supertest';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { SchoolsRepository } from '@schools/repositories/schools.repository';
import { SubscribesRepository } from '@subscribes/subscribes.repository';
import { SubscribesService } from '@subscribes/subscribes.service';
import {
  mockAggregateFeedList1,
  mockSchoolDocumentList,
  mockSubscribesFeedList,
  mockUserListDocument,
  mockUserWithSubscribedSchoolList,
} from '@test/mocks';
import { UsersController } from '@users/users.controller';
import { UsersRepository } from '@users/users.repository';
import { UsersService } from '@users/users.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let subscribesRepository: SubscribesRepository;
  let schoolsRepository: SchoolsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        SubscribesService,
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
        {
          provide: SubscribesRepository,
          useValue: {
            getSubscribedFeedsGroupBySchool: jest.fn(),
            getSubscribedFeedsGroupBySchoolId: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: SchoolsRepository,
          useValue: { findOne: jest.fn() },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          // 여기에 원하는 사용자 객체를 직접 주입
          req.user = { _id: new Types.ObjectId('660532dd8d1217b2da9e7d7c'), role: 'student' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    subscribesRepository = moduleFixture.get<SubscribesRepository>(SubscribesRepository);
    schoolsRepository = moduleFixture.get<SchoolsRepository>(SchoolsRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users/subscriptions/school', () => {
    describe('성공 시', () => {
      it('200 상태와 구독중인 school page 목록을 반환합니다.', async () => {
        jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUserWithSubscribedSchoolList);

        const expected = mockUserWithSubscribedSchoolList.subscribeList.map((subscribedSchool) => ({
          _id: subscribedSchool.school._id.toHexString(),
          name: subscribedSchool.school.name,
          location: subscribedSchool.school.location,
          adminId: subscribedSchool.school.adminId.toHexString(),
          createdAt: subscribedSchool.school.createdAt.toISOString(),
        }));

        return request(app.getHttpServer()).get('/users/subscriptions/schools').expect(200).expect(expected);
      });

      it('구독 중인 school page 목록이 없다면, 200 상태와 빈 배열을 반환합니다.', async () => {
        jest
          .spyOn(usersRepository, 'findOne')
          .mockResolvedValueOnce({ ...mockUserWithSubscribedSchoolList, subscribeList: [] });

        return request(app.getHttpServer()).get('/users/subscriptions/schools').expect(200).expect([]);
      });
    });

    describe('실패 시', () => {
      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).get('/users/subscriptions/schools').expect(500);
      });
    });
  });

  describe('GET /users/subscriptions/schools/feeds', () => {
    describe('성공 시', () => {
      it('200 상태와 구독중인 school page 와 피드 목록을 반환합니다.', async () => {
        jest
          .spyOn(subscribesRepository, 'getSubscribedFeedsGroupBySchool')
          .mockResolvedValueOnce(mockAggregateFeedList1);

        const expected = mockAggregateFeedList1.map((subscribesFeed) => ({
          _id: subscribesFeed._id.toHexString(),
          content: subscribesFeed.content,
          adminId: subscribesFeed.adminId.toHexString(),
          createdAt: subscribesFeed.createdAt.toISOString(),
          school: {
            _id: subscribesFeed.school._id.toHexString(),
            name: subscribesFeed.school.name,
            location: subscribesFeed.school.location,
          },
        }));

        return request(app.getHttpServer()).get('/users/subscriptions/schools/feeds').expect(200).expect(expected);
      });

      it('구독 중인 school page 목록이 없다면, 200 상태와 빈 배열을 반환합니다.', async () => {
        jest.spyOn(subscribesRepository, 'getSubscribedFeedsGroupBySchool').mockResolvedValueOnce([]);

        return request(app.getHttpServer()).get('/users/subscriptions/schools/feeds').expect(200).expect([]);
      });
    });

    describe('실패 시', () => {
      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest
          .spyOn(subscribesRepository, 'getSubscribedFeedsGroupBySchool')
          .mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).get('/users/subscriptions/schools/feeds').expect(500);
      });
    });
  });

  describe('GET /users/subscriptions/schools/:schoolId', () => {
    describe('성공 시', () => {
      it('200 상태와 구독중인 특정 school page 와 피드 목록을 반환합니다.', async () => {
        jest
          .spyOn(subscribesRepository, 'getSubscribedFeedsGroupBySchoolId')
          .mockResolvedValueOnce(mockSubscribesFeedList[0]);

        const expected = {
          _id: mockSubscribesFeedList[0].school._id.toHexString(),
          name: mockSubscribesFeedList[0].school.name,
          location: mockSubscribesFeedList[0].school.location,
          adminId: mockSubscribesFeedList[0].school.adminId.toHexString(),
          createdAt: mockSubscribesFeedList[0].school.createdAt.toISOString(),
          feedList: mockSubscribesFeedList[0].school.feedList.map((feed) => {
            return {
              _id: feed._id.toHexString(),
              content: feed.content,
              adminId: feed.adminId.toHexString(),
              createdAt: feed.createdAt.toISOString(),
            };
          }),
        };

        return request(app.getHttpServer())
          .get('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5')
          .expect(200)
          .expect(expected);
      });
    });

    describe('실패 시', () => {
      it('구독하지 않은 학교에 대해 요청할 경우, 403 상태를 방환합니다. ', async () => {
        jest.spyOn(subscribesRepository, 'getSubscribedFeedsGroupBySchoolId').mockResolvedValueOnce(null);

        return request(app.getHttpServer()).get('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(403);
      });

      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest
          .spyOn(subscribesRepository, 'getSubscribedFeedsGroupBySchoolId')
          .mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).get('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(500);
      });
    });
  });

  describe('POST /users/subscriptions/schools/:schoolId', () => {
    beforeEach(() => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUserListDocument[0]);
    });

    describe('성공 시', () => {
      it('201 상태와 구독중인 특정 school page 와 피드 목록을 반환합니다.', async () => {
        jest.spyOn(usersRepository, 'findOneAndUpdate').mockResolvedValueOnce(null);
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(mockSchoolDocumentList[0]);
        jest.spyOn(subscribesRepository, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(subscribesRepository, 'create').mockResolvedValueOnce(mockSubscribesFeedList[0]);

        return request(app.getHttpServer()).post('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(201);
      });
    });

    describe('실패 시', () => {
      it('구독하려는 학교가 없는 경우, 404 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(null);

        return request(app.getHttpServer()).post('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(404);
      });

      it('이미 구독한 학교의 경우, 409 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(mockSchoolDocumentList[0]);
        jest.spyOn(subscribesRepository, 'findOne').mockResolvedValueOnce(mockSubscribesFeedList[0]);

        return request(app.getHttpServer()).post('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(409);
      });

      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).post('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(500);
      });
    });
  });

  describe('DELETE /users/subscriptions/schools/:schoolId', () => {
    beforeEach(() => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUserListDocument[0]);
    });

    describe('성공 시', () => {
      it('200 상태를 반환합니다.', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(mockSchoolDocumentList[0]);

        return request(app.getHttpServer()).delete('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(200);
      });
    });

    describe('실패 시', () => {
      it('구독 취소하려는 학교가 없는 경우, 404 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockResolvedValueOnce(null);

        return request(app.getHttpServer()).delete('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(404);
      });

      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(schoolsRepository, 'findOne').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).delete('/users/subscriptions/schools/6603e8a6ad74c24305aa42d5').expect(500);
      });
    });
  });
});
