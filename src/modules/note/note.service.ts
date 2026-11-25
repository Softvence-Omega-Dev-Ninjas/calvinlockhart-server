import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto/create.note.dto";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    const { preceptId, description } = dto;
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new BadRequestException("Unauthorized Access");

    const precept = await this.prisma.precept.findUnique({
      where: { id: preceptId },
      include: { topic: true },
    });
    if (!precept) throw new NotFoundException("Precept not found");

    if (precept.topic.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to add notes to this precept",
      );
    }

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

    const note = await this.prisma.note.findUnique({
      where: { id: nodeId },
      include: {
        precept: {
          include: { topic: true },
        },
      },
    });
    if (!note) throw new NotFoundException("Note not found");

    if (note.precept.topic.userId !== userId) {
      throw new ForbiddenException("You are not allowed to update this note");
    }

    return this.prisma.note.update({
      where: { id: nodeId },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new BadRequestException("Unauthorized Access");

    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        precept: {
          include: { topic: true },
        },
      },
    });
    if (!note) throw new NotFoundException("Note not found");

    if (note.precept.topic.userId !== userId) {
      throw new ForbiddenException("You are not allowed to delete this note");
    }

    return this.prisma.note.delete({ where: { id } });
  }
}
