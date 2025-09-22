import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto } from "./dto/create.topic.dto";
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
    return this.prisma.topic.findMany({
      where: { userId },
      include: { precepts: {
        include:{
          notes:true
        }
      } },
    });
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
      include: { precepts: {
        include:{
          notes:true
        }
      }},
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
    // Shuffle topics randomly
    // const shuffledTopics = preceptTopic.sort(() => 0.5 - Math.random());

    // // For each topic, pick a random precept
    // const result = shuffledTopics.map((topic) => {
    //   const precepts = topic.precepts;
    //   if (!precepts || precepts.length === 0) return { ...topic, randomPrecept: null };

    //   const randomIndex = Math.floor(Math.random() * precepts.length);
    //   return { ...topic, randomPrecept: precepts[randomIndex] };
    // });

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
  async updateTopic(userId: string, id: string, dto: CreateTopicDto) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException("Not allowed to update this topic");
    }

    return this.prisma.topic.update({
      where: { id },
      data: {
        name: dto.name,
        destination: dto.destination,
        precepts: {
          deleteMany: {},
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
}
