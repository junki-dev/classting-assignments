import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import * as request from 'supertest';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { SignUpDto } from '@auth/dto/sign-up.dto';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { mockUserListDocument } from '@test/mocks';
import { UsersRepository } from '@users/users.repository';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [() => ({ JWT_SECRET: 'e2etestsecret', JWT_EXPIRATION: 3600 })] }),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          // 여기에 원하는 사용자 객체를 직접 주입
          req.user = { _id: new Types.ObjectId('6603e88fad74c24305aa42ca'), role: 'admin' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/sign-up', () => {
    const signUpDto: SignUpDto = {
      email: 'tester@sample.com',
      password: 'StringPwd!23',
      role: 'admin',
    };

    describe('성공 시', () => {
      it('200 상태와 school page 목록을 반환합니다.', async () => {
        jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

        return request(app.getHttpServer()).post('/auth/sign-up').send(signUpDto).expect(201);
      });
    });

    describe('실패 시', () => {
      it('동일한 email 이 존재하는 경우, 409 상태를 반환합니다. ', async () => {
        jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(mockUserListDocument[0]);

        return request(app.getHttpServer()).post('/auth/sign-up').send(signUpDto).expect(409);
      });

      it('데이터베이스 에러의 경우, 500 상태를 반환합니다. ', async () => {
        jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new InternalServerErrorException());

        return request(app.getHttpServer()).post('/auth/sign-up').send(signUpDto).expect(500);
      });
    });
  });

  describe('POST /auth/sign-in', () => {
    describe('성공 시', () => {
      it('201 상태와 school page 목록을 반환합니다.', async () => {
        return request(app.getHttpServer())
          .post('/auth/sign-in')
          .expect(201)
          .then((data) => {
            const { token } = data.body;

            expect(typeof token).toBe('string');
          });
      });
    });
  });
});
