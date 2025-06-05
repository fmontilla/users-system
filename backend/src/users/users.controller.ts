import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto, @User() user: any) {
    this.logger.log(`User ${user.email} creating new user: ${createUserDto.email}`, 'UsersController');
    try {
      const newUser = await this.usersService.create(createUserDto);
      this.logger.log(`User created successfully: ${newUser.email}`, 'UsersController');
      return newUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack, 'UsersController');
      throw error;
    }
  }

  @Get()
  async findAll(@User() user: any) {
    this.logger.log(`User ${user.email} fetching all users`, 'UsersController');
    try {
      const users = await this.usersService.findAll();
      this.logger.log(`Retrieved ${users.length} users`, 'UsersController');
      return users;
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack, 'UsersController');
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    this.logger.log(`User ${user.email} fetching user with ID: ${id}`, 'UsersController');
    try {
      const foundUser = await this.usersService.findOne(id);
      this.logger.log(`User found: ${foundUser.email}`, 'UsersController');
      return foundUser;
    } catch (error) {
      this.logger.error(`Error fetching user ${id}: ${error.message}`, error.stack, 'UsersController');
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @User() user: any,
  ) {
    this.logger.log(`User ${user.email} updating user with ID: ${id}`, 'UsersController');
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      this.logger.log(`User updated successfully: ${updatedUser.email}`, 'UsersController');
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user ${id}: ${error.message}`, error.stack, 'UsersController');
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    this.logger.log(`User ${user.email} deleting user with ID: ${id}`, 'UsersController');
    try {
      await this.usersService.remove(id);
      this.logger.log(`User ${id} deleted successfully`, 'UsersController');
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting user ${id}: ${error.message}`, error.stack, 'UsersController');
      throw error;
    }
  }
} 