import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Create user entry in the database
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Hash the password
      const hashedPassword = await hash(createUserDto.password, 10);

      // Create a new user instance with the hashed password
      const createUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      // Save the user to the database
      return await createUser.save();
    } catch (err) {
      throw new Error(`Failed to create user: ${err.message}`);
    }
  }

  // Find all users registered in the database
  async findAll(): Promise<User[] | object> {
    try {
      const result = await this.userModel.find().exec();
      return !result ? { message: 'No users found' } : result;
    } catch (err) {
      throw new Error(`Failed to fetch users: ${err.message}`);
    }
  }

  // Get user by its email
  async getUser(email: string): Promise<User | object> {
    try {
      const result = await this.userModel.find({ email }).exec();
      return !result ? { message: 'No users found' } : result;
    } catch (err) {
      throw new Error(`Failed to fetch user by its id: ${err.message}`);
    }
  }

  // Update user information in the database by its ID
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
    } catch (err) {
      throw new Error(`Failed to update user: ${err.message}`);
    }
  }

  // Soft delete user
  async softDeleteUser(id: string): Promise<void> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('user not found');
      }
      user.deletedAt = new Date();
      await user.save();
    } catch (err) {
      throw new Error(`Failed to soft delete user: ${err.message}`);
    }
  }
}
