import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { SignUpDto } from '@auth/dto/sign-up.dto';
import { TokenPayload } from '@auth/interfaces/token-payload.interface';
import { UserDocument } from '@users/models/user.schema';
import { UsersRepository } from '@users/users.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * sign up
   * @param {SignUpDto} signUpDto     sign up dto
   * @returns {Promise<UserDocument>} created user document
   */
  async signUp(signUpDto: SignUpDto) {
    const userDocument = await this.usersRepository.findOne({ email: signUpDto.email });
    if (userDocument) {
      this.logger.error(`already exist email, email=${signUpDto.email}`);
      throw new ConflictException(`already exist email, email=${signUpDto.email}`);
    }

    return this.usersRepository.create({
      ...signUpDto,
      password: await bcrypt.hash(signUpDto.password, 10),
    });
  }

  /**
   * sign in
   * @param {UserDocument} user
   * @returns {Promise<string>}
   */
  async signIn(user: UserDocument) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
      role: user.role,
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    return this.jwtService.sign(tokenPayload);
  }

  /**
   * verify user
   * @param {string} email            email
   * @param {string} password         password
   * @returns {Promise<UserDocument>} valid user document
   */
  async verifyUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException(`invalid credentials, email=${email}`);
    }
    return user;
  }
}
