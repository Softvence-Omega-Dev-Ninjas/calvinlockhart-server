import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto } from "./dto/create.topic.dto";
import { AddPreceptsDto } from "./dto/create.precept.dto";

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) { }

  async createTopic(userId: string, dto: CreateTopicDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId }
    })

    if (!user) {
      throw new BadRequestException("Unauthorized Access.")
    }
    return await this.prisma.topic.create({
      data: {
        name: dto.name,
        userId,
        precepts: {
          create: dto.precepts?.map((p) => ({
            reference: p.reference,
            content: p.content
          })) || [],
        },
      },
      include: { precepts: true }
    });
  }

  async findAll(userId: string) {
    return this.prisma.topic.findMany({
      where: { userId },
      include: { precepts: true },
    });
  }

  async findOne(userId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException("Unauthorized Accesss.")
    }
    const topic = await this.prisma.topic.findUnique({ where: { id } })
    if (!topic) {
      throw new NotFoundException("Topic is Not Found")
    }
    return this.prisma.topic.findFirst({
      where: { id, userId },
      include: { precepts: true },
    });
  }

  async removeTopic(userId: string, id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id } })
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Not allowed to delete this topic');
    }
    await this.prisma.topic.delete({
      where: { id }
    })
    return null
  }

  async updateTopic(userId: string, id: string, dto: CreateTopicDto) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Not allowed to update this topic');
    }

    return this.prisma.topic.update({
      where: { id },
      data: {
        name: dto.name,
        precepts: {
          deleteMany: {},
          create: dto.precepts?.map((p) => ({
            reference: p.reference,
            content: p.content,
          })) || [],
        },
      },
      include: { precepts: true },
    });
  }

  async addPrecepts(userId: string, topicId: string, dto: AddPreceptsDto) {
    const topic = await this.prisma.topic.findUnique({ where: { id: topicId } })
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Not allowed to update this topic');
    }
    const precept = await this.prisma.precept.create({
      data: {
        content: 'Some content',
        reference: 'Some reference',
        topic: {
          connect: { id: topicId }, // or create if new
        },
      },
    });



  }


}