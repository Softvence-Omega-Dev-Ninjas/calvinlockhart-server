import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.update.dto';
import { handleRequest } from 'src/common/utils/request.handler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Todo convert user login.... 
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return handleRequest(
      () => this.usersService.findOne(email),
      'User fetched successfully',
    );
  }

  @Put(':email')
  async updateUser(@Param('email') id: string, @Body() dto: UpdateUserDto) {
    return handleRequest(
      () => this.usersService.updateUser(id, dto),
      'User updated successfully',
    );
  }
}
