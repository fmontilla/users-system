import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersService } from './users.service';

@Controller('public/users')
export class PublicUsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async findAll() {
    this.logger.log('Public request for all users', 'PublicUsersController');
    try {
      const users = await this.usersService.findAll();
      this.logger.log(`Retrieved ${users.length} users for public access`, 'PublicUsersController');
      return users;
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack, 'PublicUsersController');
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Public request for user with ID: ${id}`, 'PublicUsersController');
    try {
      const user = await this.usersService.findOne(id);
      this.logger.log(`User found for public access: ${user.email}`, 'PublicUsersController');
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user ${id}: ${error.message}`, error.stack, 'PublicUsersController');
      throw error;
    }
  }
} 