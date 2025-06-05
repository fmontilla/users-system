import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let redisService: RedisService;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    flushPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and flush cache', async () => {
      const createUserDto = { name: 'John Doe', email: 'john@example.com' };
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(mockRedisService.flushPattern).toHaveBeenCalledWith('users:*');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return cached users if available', async () => {
      const serializedUser = {
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
      };
      const cachedUsers = JSON.stringify([serializedUser]);
      mockRedisService.get.mockResolvedValue(cachedUsers);

      const result = await service.findAll();

      expect(mockRedisService.get).toHaveBeenCalledWith('users:all');
      expect(result).toEqual([serializedUser]);
      expect(mockPrismaService.user.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not cached', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'users:all',
        JSON.stringify([mockUser]),
        300,
      );
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return cached user if available', async () => {
      const serializedUser = {
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
      };
      const cachedUser = JSON.stringify(serializedUser);
      mockRedisService.get.mockResolvedValue(cachedUser);

      const result = await service.findOne(1);

      expect(mockRedisService.get).toHaveBeenCalledWith('users:1');
      expect(result).toEqual(serializedUser);
      expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not cached', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'users:1',
        JSON.stringify(mockUser),
        300,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user and flush cache', async () => {
      const updateUserDto = { name: 'Jane Doe' };
      const updatedUser = { ...mockUser, name: 'Jane Doe' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
      expect(mockRedisService.flushPattern).toHaveBeenCalledWith('users:*');
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Jane Doe' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove user and flush cache', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await service.remove(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRedisService.flushPattern).toHaveBeenCalledWith('users:*');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 