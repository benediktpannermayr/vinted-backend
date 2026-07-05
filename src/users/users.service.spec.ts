import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

describe('UsersService', () => {
  let usersService: UsersService;
  let repository: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: USER_REPOSITORY, useValue: repository },
      ],
    }).compile();

    usersService = module.get(UsersService);
  });

  it('delegates findByEmail to the repository', async () => {
    repository.findByEmail.mockResolvedValue(null);
    await usersService.findByEmail('user@example.com');
    expect(repository.findByEmail).toHaveBeenCalledWith('user@example.com');
  });

  it('delegates findById to the repository', async () => {
    repository.findById.mockResolvedValue(null);
    await usersService.findById('user-1');
    expect(repository.findById).toHaveBeenCalledWith('user-1');
  });

  describe('create', () => {
    it('creates the user when the email is not already taken', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        password: 'hashed',
        createdAt: new Date(),
      });

      const result = await usersService.create({
        email: 'user@example.com',
        password: 'hashed',
      });

      expect(repository.create).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'hashed',
      });
      expect(result.email).toBe('user@example.com');
    });

    it('throws ConflictException when the email is already registered', async () => {
      repository.findByEmail.mockResolvedValue({
        id: 'existing',
        email: 'user@example.com',
        password: 'hashed',
        createdAt: new Date(),
      });

      await expect(
        usersService.create({ email: 'user@example.com', password: 'hashed' }),
      ).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});
