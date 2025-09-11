import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/users.update.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    email: string,
    password: string,
    confirmPassword: string,
    username?: string,
  ) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already used');
    const hashed = await bcrypt.hash(password, 10);

    if (password !== confirmPassword) {
      throw new BadRequestException('Please Provide Valid Credentials.');
    }
    return this.prisma.user.create({
      data: { email, password: hashed, username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setEmailVerified(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  async updatePassword(userId: string, oldPassword:string, newPassword: string) {
    const user = await this.prisma.user.findFirst({where:{id:userId}})
    if(!user){
      throw new NotFoundException("User Not found")
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
       throw new UnauthorizedException('Invalid credentials Old Password is Invalide');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }
  
   async forgetUpdatePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }

  

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // get user by id
  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('Unvalid User');
    }
    return user;
  }

  // user update
  async updateUser(email: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User is Not found');
    }
    return this.prisma.user.update({
      where: { email },
      data: dto,
    });
  }
}
