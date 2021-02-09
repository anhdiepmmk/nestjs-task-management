import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';

const jwtConfig: any = config.get('jwt');

const mockCredentialsDto = {
  username: 'TestUsername',
  password: 'TestPassword',
};

const userRepository = new UserRepository();

const mockUserRepository = () => ({
  signUp: userRepository.signUp,
  hashPassword: userRepository.hashPassword,
  create: () => ({}),
});

describe('UserRepository', () => {
  // let tasksService;
  // let taskRepository;

  // beforeEach(async () => {
  //   const module = await Test.createTestingModule({
  //     providers: [
  //       TasksService,
  //       { provide: TaskRepository, useFactory: mockTaskRepository },
  //     ],
  //   }).compile();

  //   tasksService = await module.get<TasksService>(TasksService);
  //   taskRepository = await module.get<TaskRepository>(TaskRepository);
  // });

  let userRepository;
  let authService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    it('should successfully signs up the user', async () => {
      userRepository.create = () => ({
        save: async () => {
          return;
        },
      });
      expect(authService.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('should throws a conflict exception as username already exists', () => {
      userRepository.create = () => ({
        save: async () => {
          throw { code: '23505' };
        },
      });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throws a conflict exception as username already exists', () => {
      userRepository.create = () => ({
        save: async () => {
          throw { code: '123123' }; // unhandled error code
        },
      });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
