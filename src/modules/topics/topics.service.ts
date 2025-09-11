import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto } from "./dto/create.topic.dto";
import { AddPreceptsDto } from "./dto/create.precept.dto";

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) { }
  // create new topic
  async createTopic(userId: string, dto: CreateTopicDto) {
    console.log(userId)
    const user = await this.prisma.user.findFirst({
      where: { id: userId }
    })

    if (!user) {
      throw new BadRequestException("Unauthorized Access.")
    }
    return await this.prisma.topic.create({
      data: {
        name: dto.name,
        destination:dto.destination,
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
  //  find user all topics
  async findAll(userId: string) {
    return this.prisma.topic.findMany({
      where: { userId },
      include: { precepts: true },
    });
  }
  // find topic
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
  // remove topic
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
  // update topic
  async updateTopic(userId: string, id: string, dto: CreateTopicDto) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Not allowed to update this topic');
    }

    return this.prisma.topic.update({
      where: { id },
      data: {
        name: dto.name,
        destination:dto.destination,
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
  // add precepts
  async addPrecepts(userId: string, topicId: string, dto: AddPreceptsDto) {
    const topic = await this.prisma.topic.findUnique({ where: { id: topicId } })
    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Not allowed to update this topic');
    }
    if (!dto.precepts?.length) {
      throw new BadRequestException("Precepts Data required.")
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
    return { message: 'Precepts added successfully', precepts };
  }

  
  // added fovourite topic..
  // async addFovorite(userId: string, topicId: string) {
  //   const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
  //   if (!topic) throw new NotFoundException('Topic not found');

  //   const user = await this.prisma.user.findFirst({ where: { id: userId } })
  //   if (!user) throw new BadRequestException('unauthorized access');

  //   const existing = await this.prisma.favorite.findUnique({
  //     where: { userId_topicId: { userId, topicId } },
  //   });
  //   if (existing) throw new BadRequestException('Topic already favorited');

  //   const favorite = await this.prisma.favorite.create({
  //     data: {
  //       userId,
  //       topicId
  //     },
  //     include: {
  //       topic: true
  //     }
  //   });
  //   return favorite
  // }

  // // remove favourite topic...
  // async removeFovorite(userId: string, topicId: string) {
  //   const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
  //   if (!topic) throw new NotFoundException('Topic not found');

  //   const user = await this.prisma.user.findFirst({ where: { id: userId } })
  //   if (!user) throw new BadRequestException('unauthorized access');
  //   const favorite = await this.prisma.favorite.findUnique({
  //     where: { userId_topicId: { userId, topicId } },
  //   });
  //   if (!favorite) throw new NotFoundException('Favorite not found');

  //   await this.prisma.favorite.delete({ where: { userId_topicId: { userId, topicId } } });
  //   return { message: 'Topic removed from favorites' };
  // }
  // // get favorite...
  // async getFovorites(userId: string){
  //   const favorites = await this.prisma.favorite.findMany({where:{ userId: userId}, include:{topic:true}})
  //   console.log(favorites)
  //   return favorites
  // }

}