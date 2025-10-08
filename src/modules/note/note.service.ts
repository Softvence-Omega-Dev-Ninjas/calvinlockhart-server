import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto/create.note.dto";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId, dto: CreateNoteDto) {
    const { preceptId, description } = dto;
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new BadRequestException("Unauthorized Access");
    // Verify topic exists
    const topic = await this.prisma.precept.findUnique({
      where: { id: preceptId },
    });
    if (!topic) throw new NotFoundException("Topic not found");

    return this.prisma.note.create({
      data: {
        preceptId: preceptId,
        description: description || "",
      },
    });
  }

  async update(userId: string, nodeId: string, dto: UpdateNoteDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new BadRequestException("Unauthorized Access");

    const note = await this.prisma.note.findUnique({ where: { id: nodeId } });
    if (!note) throw new NotFoundException("Note not found");

    return this.prisma.note.update({
      where: { id: nodeId },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new BadRequestException("Unauthorized Access");
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException("Note not found");

    return this.prisma.note.delete({ where: { id } });
  }
}
