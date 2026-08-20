import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { handleRequest } from "src/common/utils/request.handler";
import { UpdateUserDto } from "./dto/users.update.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
// @UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Todo convert user login....
  @ApiOperation({ summary: "Show user own information" })
  @Get("/me")
  async findOne(@Request() req) {
    const email = req.user.email;
    return handleRequest(
      () => this.usersService.findOne(email),
      "User fetched successfully",
    );
  }

  // @UseInterceptors(FileInterceptor('userAvatar', { storage }))
  @ApiOperation({ summary: "Update user information" })
  @Put("/updateMe")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdateUserDto, required: false })
  @UseInterceptors(FileInterceptor("file")) // 'image' is the name of the form field
  async updateUser(
    @Request() req,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const email = req.user.email;
    if (file) {
      const { secure_url }: any = await this.usersService.uploadImages(file);
      if (!secure_url) throw new ConflictException("not found");
      dto["userAvatar"] = secure_url;
    }
    return handleRequest(
      () => this.usersService.updateUser(email, dto),
      "User updated successfully",
    );
  }

  @ApiOperation({ summary: "Delete user account" })
  @Delete("/account/delete")
  deleteAccount(@Request() req: any) {
    const userId = req.user.userId || req.user.sub;
    return handleRequest(
      () => this.usersService.deleteUserAccount(userId),
      "Account deleted successfully",
    );
  }

  @Delete("account/:email")
  deleteAccountByEmail(@Request() req: any, @Param("email") email: string) {
    return handleRequest(
      () => this.usersService.deleteUserAccountByEmail(email),
      "Account deleted successfully",
    );
  }
}
