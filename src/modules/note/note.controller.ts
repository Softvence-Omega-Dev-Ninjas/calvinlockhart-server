import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt.guards";
import { NotesService } from "./note.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto/create.note.dto";
import { handleRequest } from "src/common/utils/request.handler";

@ApiTags('notes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
    constructor(private readonly service: NotesService) { }
    @Post('')
    create(@Body() dto: CreateNoteDto, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.create(userId, dto),
            'Create Note successfully',
        );
    }

    @Patch(':nodeId')
    update(@Param('nodeId') nodeId: string, @Body() dto: UpdateNoteDto, @Request() req) {
        const userId = req.user.sub;
        return handleRequest(
            () => this.service.update(userId, nodeId, dto),
            'Update Note successfully',
        );
    }

    @Delete(':nodeId')
    remove(@Param('nodeId') nodeId: string, @Request() req) {
         const userId = req.user.sub;
        return handleRequest(
            () => this.service.remove(userId, nodeId),
            'Remove Note successfully',
        );
    }


}