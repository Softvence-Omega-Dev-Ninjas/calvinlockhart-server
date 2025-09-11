import { Body, Controller, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.update.dto';
import { handleRequest } from 'src/common/utils/request.handler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';


@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Todo convert user login.... 
  @ApiOperation({ summary: "Show user own information" })
  @Get('/me')
  async findOne(@Request() req) {
    const email = req.user.email
    return handleRequest(
      () => this.usersService.findOne(email),
      'User fetched successfully',
    );
  }

  @ApiOperation({ summary: "Update user information" })
  @Put('/updateMe')
  async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
    const email = req.user.email;
    return handleRequest(
      () => this.usersService.updateUser(email, dto),
      'User updated successfully',
    );
  }
}
