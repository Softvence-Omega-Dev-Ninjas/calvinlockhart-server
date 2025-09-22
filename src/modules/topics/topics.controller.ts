import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { CreateTopicDto } from "./dto/create.topic.dto";
import { handleRequest } from "src/common/utils/request.handler";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt.guards";
import { AddPreceptsDto } from "./dto/create.precept.dto";
import { QueryTopicDto } from "./dto/topic.query.dto";

@ApiTags("Topics")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("topics")
export class TopicsController {
  constructor(private readonly service: TopicsService) {}

  // Create New Topic
  @ApiOperation({ summary: "Create New Topic" })
  @Post()
  create(@Body() dto: CreateTopicDto, @Request() req) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.createTopic(userId, dto),
      "Create Topic successfully",
    );
  }

  // Get User all Topic
  @ApiOperation({ summary: "Get All Topic" })
  @Get()
  findAll(@Request() req) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.findAll(userId),
      "Get All Topic successfully",
    );
  }

  @Get("/precepts-topic")
  findPreceptTopic(@Request() req, @Query() query?: QueryTopicDto) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.findPreceptTopic(userId, query),
      "Get All Precept Topic successfully",
    );
  }
  @Get("/lessons-topic")
  findLessonTopic(@Request() req, @Query() query?: QueryTopicDto) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.findLessonTopic(userId, query),
      "Get All Lesson Topic successfully",
    );
  }
  @Get("/favorites-topic")
  findFavoriteTopic(@Request() req, @Query() query?: QueryTopicDto) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.findFavoriteTopic(userId, query),
      "Get All Favorites Topic successfully",
    );
  }

  // Get Single Topic
  @ApiOperation({ summary: "Get a Single Topic" })
  @Get(":topicId")
  findOne(@Param("topicId") topicId: string, @Request() req) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.findOne(userId, topicId),
      "Get Single Topic successfully",
    );
  }
  // Remove Topic
  @ApiOperation({ summary: "Remove Topic" })
  @Delete(":topicId")
  removeTopic(@Param("topicId") topicId: string, @Request() req) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.removeTopic(userId, topicId),
      "Remove Topic successfully",
    );
  }

  // Update Topic
  @Put(":topicId")
  @ApiOperation({ summary: "Update Topic" })
  update(
    @Param("topicId") topicId: string,
    @Request() req,
    @Body() dto: CreateTopicDto,
  ) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.updateTopic(userId, topicId, dto),
      "Update Topic successfully",
    );
  }

  // Add precepts...
  @Post(":topicId/addPrecept")
  @ApiOperation({ summary: "Add precepts to an existing topic" })
  async addPreceptsToTopic(
    @Param("topicId") topicId: string,
    @Request() req,
    @Body() dto: AddPreceptsDto,
  ) {
    const userId = req.user.sub;
    return handleRequest(
      () => this.service.addPrecepts(userId, topicId, dto),
      "Added Another Precepts successfully",
    );
  }
}
