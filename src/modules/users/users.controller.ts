import {
  Body,
  ConflictException,
  Controller,
  Get,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/users.update.dto";
import { handleRequest } from "src/common/utils/request.handler";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt.guards";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
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
}
