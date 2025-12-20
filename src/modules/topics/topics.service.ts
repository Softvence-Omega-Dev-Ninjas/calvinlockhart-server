import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto, UpdateTopicDto } from "./dto/create.topic.dto";
import { AddPreceptsDto } from "./dto/create.precept.dto";
import { QueryTopicDto } from "./dto/topic.query.dto";

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}
  // create new topic
  async createTopic(userId: string, dto: CreateTopicDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("Unauthorized Access.");
    }
    return await this.prisma.topic.create({
      data: {
        name: dto.name,
        destination: dto.destination,
        userId,
        precepts: {
          create:
            dto.precepts?.map((p) => ({
              reference: p.reference,
              content: p.content,
            })) || [],
        },
      },
      include: { precepts: true },
    });
  }
  //  find user all topics
  async findAll(userId: string) {
    const topics = await this.prisma.topic.findMany({
      where: { userId },
      include: {
        precepts: {
          orderBy: { reference: "asc" },
          include: { notes: true },
        },
      },
    });

    return topics.map((topic) => ({
      ...topic,
      precepts: this.groupPrecepts(topic.precepts),
    }));
  }
  // find topic
  async findOne(userId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("Unauthorized Accesss.");
    }
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) {
      throw new NotFoundException("Topic is Not Found");
    }
    return this.prisma.topic.findFirst({
      where: { id, userId },
      include: {
        precepts: {
          orderBy: {
            reference: "asc",
          },
          include: {
            notes: true,
          },
        },
      },
    });
  }
  // precepts topic
  async findPreceptTopic(userId: string, query?: QueryTopicDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("Unauthorized Access.");
    }
    const q = query?.q;
    const hasQuery = q && q.trim() !== "";
    const preceptTopic = await this.prisma.topic.findMany({
      where: {
        userId,
        destination: "PRECEPT_TOPIC",
        ...(hasQuery
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                {
                  precepts: {
                    some: {
                      OR: [
                        { reference: { contains: q, mode: "insensitive" } },
                        { content: { contains: q, mode: "insensitive" } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        precepts: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!preceptTopic || preceptTopic.length === 0) {
      throw new NotFoundException("Precept Topic not found");
    }

    return preceptTopic;
  }

  // lessons topic
  async findLessonTopic(userId: string, query?: QueryTopicDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("Unauthorized Access.");
    }
    const q = query?.q;
    const hasQuery = q && q.trim() !== "";
    const preceptTopic = await this.prisma.topic.findMany({
      where: {
        userId,
        destination: "LESSON_PRECEPTS",
        ...(hasQuery
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                {
                  precepts: {
                    some: {
                      OR: [
                        { reference: { contains: q, mode: "insensitive" } },
                        { content: { contains: q, mode: "insensitive" } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        precepts: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!preceptTopic || preceptTopic.length === 0) {
      throw new NotFoundException("Precept Topic not found");
    }

    return preceptTopic;
  }
  // favorite topic
  async findFavoriteTopic(userId: string, query?: QueryTopicDto) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("Unauthorized Access.");
    }
    const q = query?.q;
    const hasQuery = q && q.trim() !== "";
    const preceptTopic = await this.prisma.topic.findMany({
      where: {
        userId,
        destination: "FAVORITES",
        ...(hasQuery
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                {
                  precepts: {
                    some: {
                      OR: [
                        { reference: { contains: q, mode: "insensitive" } },
                        { content: { contains: q, mode: "insensitive" } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        precepts: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!preceptTopic || preceptTopic.length === 0) {
      throw new NotFoundException("Precept Topic not found");
    }

    return preceptTopic;
  }

  // remove topic
  async removeTopic(userId: string, id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException("Not allowed to delete this topic");
    }
    await this.prisma.topic.delete({
      where: { id },
    });
    return null;
  }
  // update topic
  async patchUpdateTopic(userId: string, id: string, dto: UpdateTopicDto) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: { precepts: true },
    });

    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException("Not allowed to update this topic");
    }
    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.destination !== undefined) updateData.destination = dto.destination;

    if (dto.precepts?.length) {
      updateData.precepts = {
        deleteMany: {},
        create: dto.precepts.map((p) => ({
          reference: p.reference,
          content: p.content,
        })),
      };
    }

    return this.prisma.topic.update({
      where: { id },
      data: updateData,
      include: { precepts: true },
    });
  }
  // add precepts
  async addPrecepts(userId: string, topicId: string, dto: AddPreceptsDto) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException("Not allowed to update this topic");
    }
    if (!dto.precepts?.length) {
      throw new BadRequestException("Precepts Data required.");
    }
    const precepts = await Promise.all(
      dto.precepts.map((p) =>
        this.prisma.precept.create({
          data: {
            reference: p.reference,
            content: p.content,
            topic: {
              connect: { id: topicId },
            },
          },
        }),
      ),
    );
    return { message: "Precepts added successfully", precepts };
  }

  async removePrecept(userId: string, preceptId: string) {
    const precept = await this.prisma.precept.findUnique({
      where: { id: preceptId },
      include: { topic: true },
    });

    if (!precept) {
      throw new NotFoundException("Precept not found");
    }
    if (precept.topic.userId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to delete this precept",
      );
    }
    await this.prisma.precept.delete({
      where: { id: preceptId },
    });

    return { message: "Precept deleted successfully", preceptId };
  }

  private groupPrecepts(precepts: any[]) {
    const map = new Map<string, any>();

    for (const p of precepts) {
      const [bookChapter, verse] = p.reference.split(":");

      if (!map.has(bookChapter)) {
        map.set(bookChapter, {
          reference: bookChapter,
          verses: [],
          contents: [],
          notes: [],
        });
      }

      const group = map.get(bookChapter);

      group.verses.push(verse);
      group.contents.push(p.content);
      group.notes.push(...p.notes);
    }
    return Array.from(map.values()).map((g) => ({
      reference: `${g.reference}:${g.verses.join(",")}`,
      contents: g.contents,
      notes: g.notes,
    }));
  }
}
