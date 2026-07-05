import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { CreateUserData } from '../users/repositories/user.repository.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: {
    findByEmail: jest.Mock<Promise<User | null>, [string]>;
    findById: jest.Mock<Promise<User | null>, [string]>;
    create: jest.Mock<Promise<User>, [CreateUserData]>;
  };
  let jwtService: { sign: jest.Mock<string, [unknown]> };

  const storedUser = {
    id: 'user-1',
    email: 'user@example.com',
    password: '',
    createdAt: new Date(),
  };

  beforeAll(async () => {
    storedUser.password = await bcrypt.hash('CorrectPass1', 10);
  });

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn<Promise<User | null>, [string]>(),
      findById: jest.fn<Promise<User | null>, [string]>(),
      create: jest.fn<Promise<User>, [CreateUserData]>(),
    };
    jwtService = {
      sign: jest.fn<string, [unknown]>().mockReturnValue('signed.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('hashes the password before persisting and never returns it in plaintext', async () => {
      usersService.create.mockImplementation(({ email, password }) =>
        Promise.resolve({
          id: 'new-user',
          email,
          password,
          createdAt: new Date(),
        }),
      );

      const result = await authService.register({
        email: 'new@example.com',
        password: 'PlainTextPass1',
      });

      const persistedPassword = usersService.create.mock.calls[0][0].password;
      expect(persistedPassword).not.toBe('PlainTextPass1');
      expect(await bcrypt.compare('PlainTextPass1', persistedPassword)).toBe(
        true,
      );
      expect(result.user).not.toHaveProperty('password');
      expect(result.accessToken).toBe('signed.jwt.token');
    });

    it('signs a JWT payload containing sub and email', async () => {
      usersService.create.mockResolvedValue({
        id: 'new-user',
        email: 'new@example.com',
        password: 'hashed',
        createdAt: new Date(),
      });

      await authService.register({
        email: 'new@example.com',
        password: 'PlainTextPass1',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'new-user',
        email: 'new@example.com',
      });
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when the user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'missing@example.com',
          password: 'whatever',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      usersService.findByEmail.mockResolvedValue(storedUser);

      await expect(
        authService.login({
          email: storedUser.email,
          password: 'WrongPassword1',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns an access token when credentials are correct', async () => {
      usersService.findByEmail.mockResolvedValue(storedUser);

      const result = await authService.login({
        email: storedUser.email,
        password: 'CorrectPass1',
      });

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('validateUser', () => {
    it('returns null when the user referenced by the payload no longer exists', async () => {
      usersService.findById.mockResolvedValue(null);

      const result = await authService.validateUser({
        sub: 'gone',
        email: 'gone@example.com',
      });

      expect(result).toBeNull();
    });

    it('returns a safe user object without the password hash', async () => {
      usersService.findById.mockResolvedValue(storedUser);

      const result = await authService.validateUser({
        sub: storedUser.id,
        email: storedUser.email,
      });

      expect(result).toEqual({ id: storedUser.id, email: storedUser.email });
    });
  });
});
