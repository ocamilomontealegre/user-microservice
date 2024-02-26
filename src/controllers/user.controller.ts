import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  // Create user entry in the database
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const result = await this.userService.createUser(createUserDto);
      this.logger.log(`User created with data: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error creating user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find all users registered in the database
  @ApiOperation({ summary: 'Find all users in the database' })
  @Get()
  async findAll(): Promise<User[] | object> {
    try {
      const result = await this.userService.findAll();
      this.logger.log(
        `Users fetched from the database ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error fetching the users: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get user by its email
  @ApiOperation({ summary: 'Get a user data by its email' })
  @Get(':email')
  async getUser(@Param('email') email: string): Promise<User | object> {
    try {
      const result = await this.userService.getUser(email);
      this.logger.log(
        `User fetched from the database ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error fetching the user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update user information in the database by its ID
  @ApiOperation({ summary: 'Update user data by its ID' })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | object> {
    try {
      const result = await this.userService.updateUser(id, updateUserDto);
      this.logger.log(`User updated in the database ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error updating the user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Soft delete the user
  @ApiOperation({ summary: 'Soft delete user' })
  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id') id: string): Promise<object> {
    try {
      const result = this.userService.softDeleteUser(id);
      this.logger.log(
        `User deleted from the database ${JSON.stringify(result)}`,
      );
      return { message: 'User deleted successfully' };
    } catch (err) {
      this.logger.error(`Error deleteing the user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
