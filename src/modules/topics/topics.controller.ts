import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { CreateTopicDto } from "./dto/create.topic.dto";
import { handleRequest } from "src/common/utils/request.handler";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt.guards";
import { AddPreceptsDto } from "./dto/create.precept.dto";


@ApiTags('Topics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('topics')
export class TopicsController {
    constructor(private readonly service: TopicsService) { }

    @ApiOperation({ summary: "Create New Topic" })
    @Post()
    create(@Body() dto: CreateTopicDto, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.createTopic(userId, dto),
            'Create Topic successfully',
        );
    }

    @ApiOperation({ summary: "Get All Topic" })
    @Get()
    findAll(@Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.findAll(userId),
            'Get All Topic successfully',
        );
    }

    @ApiOperation({ summary: "Get a Single Topic" })
    @Get(':topicId')
    findOne(@Param('topicId') topicId: string, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.findOne(userId, topicId),
            'Get Single Topic successfully',
        );
    }

    @ApiOperation({ summary: "Remove Topic" })
    @Delete(':topicId')
    removeTopic(@Param('topicId') topicId: string, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.removeTopic(userId, topicId),
            'Remove Topic successfully',
        );
    }

    @Put(':topicId')
    update(@Param('topicId') topicId: string, @Request() req, @Body() dto: CreateTopicDto) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.updateTopic(userId, topicId, dto),
            'Update Topic successfully',
        );
    }

    @Post(':topicId/precepts')
    @ApiOperation({summary:"Add precepts to an existing topic"})
    async addPreceptsToTopic(@Param('topicId') topicId: string,@Request() req, @Body() dto:AddPreceptsDto){
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.addPrecepts(userId, topicId, dto),
            'Update Topic successfully',
        );
    }





}