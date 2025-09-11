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

    // Create New Topic
    @ApiOperation({ summary: "Create New Topic" })
    @Post()
    create(@Body() dto: CreateTopicDto, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.createTopic(userId, dto),
            'Create Topic successfully',
        );
    }

    // Get User all Topic
    @ApiOperation({ summary: "Get All Topic" })
    @Get()
    findAll(@Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.findAll(userId),
            'Get All Topic successfully',
        );
    }

    // Get Single Topic
    @ApiOperation({ summary: "Get a Single Topic" })
    @Get(':topicId')
    findOne(@Param('topicId') topicId: string, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.findOne(userId, topicId),
            'Get Single Topic successfully',
        );
    }
    // Remove Topic
    @ApiOperation({ summary: "Remove Topic" })
    @Delete(':topicId')
    removeTopic(@Param('topicId') topicId: string, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.removeTopic(userId, topicId),
            'Remove Topic successfully',
        );
    }

    // Update Topic
    @Put(':topicId')
    @ApiOperation({ summary: "Update Topic" })
    update(@Param('topicId') topicId: string, @Request() req, @Body() dto: CreateTopicDto) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.updateTopic(userId, topicId, dto),
            'Update Topic successfully',
        );
    }

    // Add precepts...
    @Post(':topicId/addPrecept')
    @ApiOperation({ summary: "Add precepts to an existing topic" })
    async addPreceptsToTopic(@Param('topicId') topicId: string, @Request() req, @Body() dto: AddPreceptsDto) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.addPrecepts(userId, topicId, dto),
            'Added Another Precepts successfully',
        );
    }
    // create favorite list.
    @Post(':topicId/favorite')
    @ApiOperation({ summary: "Topic added to favorites" })
    async addFovorite(@Param('topicId') topicId: string, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.addFovorite(userId, topicId),
            'Topic added to favorites successfully',
        );
    }

    // remove fovorite list 
    @Delete(':topicId/removeFav')
    async removeFovorite(@Param('topicId') topicId: string, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.removeFovorite(userId, topicId),
            'Topic removed from favorites',
        );
    }

    @Get('/favorites')
    async getFovorites(@Request() req) {
        const userId = req.user.sub;
        console.log('Hit get fav', userId)
        return handleRequest(
            () => this.service.getFovorites(userId),
            'Get All favorite.',
        );
    }

}