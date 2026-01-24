import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto, UpdateTopicDto } from "./dto/create.topic.dto";
import { AddPreceptsDto, UpdatePreceptDto } from "./dto/create.precept.dto";
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

    return this.prisma.topic.update({
      where: { id },
      data: updateData,
      include: {
        precepts: {
          include: {
            notes: true,
          },
        },
      },
    });
  }

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

    const incomingRefs = dto.precepts
      .map((p) => (p.reference ?? "").trim())
      .filter(Boolean);

    const dupInDto = incomingRefs.filter(
      (r, i) => incomingRefs.indexOf(r) !== i,
    );
    if (dupInDto.length) {
      throw new BadRequestException(
        `Duplicate reference in request: ${[...new Set(dupInDto)].join(", ")}`,
      );
    }

    const existing = await this.prisma.precept.findMany({
      where: {
        topicId,
        reference: { in: incomingRefs },
      },
      select: { reference: true },
    });

    if (existing.length) {
      throw new BadRequestException(
        `This reference already exists in this topic: ${existing.map((e) => e.reference).join(", ")}`,
      );
    }

    // create
    const precepts = await Promise.all(
      dto.precepts.map((p) =>
        this.prisma.precept.create({
          data: {
            reference: p.reference.trim(),
            content: p.content,
            topic: { connect: { id: topicId } },
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

  private groupPrecepts(precepts: any[] = []) {
    const groups: {
      bookChapter: string;
      verses: number[];
      contents: string[];
      notes: any[];
    }[] = [];

    for (const p of precepts ?? []) {
      const ref = (p?.reference ?? "").toString().trim();

      if (!ref.includes(":")) {
        continue;
      }

      const [bookChapterRaw, versePartRaw] = ref.split(":");
      const bookChapter = (bookChapterRaw ?? "").trim();
      const versePart = (versePartRaw ?? "").trim();

      if (!bookChapter || !versePart) continue;

      let verses: number[] = [];

      // range: 16-18
      if (versePart.includes("-")) {
        const [startStr, endStr] = versePart.split("-");
        const start = Number(startStr?.trim());
        const end = Number(endStr?.trim());

        if (
          Number.isFinite(start) &&
          Number.isFinite(end) &&
          start > 0 &&
          end >= start
        ) {
          for (let i = start; i <= end; i++) verses.push(i);
        } else {
          continue;
        }
      } else {
        verses = versePart
          .split(",")
          .map((v) => Number.parseInt(v.trim(), 10))
          .filter((n) => Number.isFinite(n) && n > 0);
      }

      if (verses.length === 0) continue;

      verses.sort((a, b) => a - b);

      let group = groups.find((g) => {
        if (g.bookChapter !== bookChapter) return false;
        const maxVerse = Math.max(...g.verses);
        return verses[0] === maxVerse + 1;
      });

      if (!group) {
        group = { bookChapter, verses: [], contents: [], notes: [] };
        groups.push(group);
      }

      group.verses.push(...verses);

      if (typeof p?.content === "string" && p.content.trim()) {
        group.contents.push(p.content);
      }

      if (Array.isArray(p?.notes)) {
        group.notes.push(...p.notes);
      }
    }

    return groups.map((g) => {
      const sortedVerses = Array.from(new Set(g.verses)).sort((a, b) => a - b);
      const minVerse = sortedVerses[0];
      const maxVerse = sortedVerses[sortedVerses.length - 1];

      return {
        reference:
          minVerse === maxVerse
            ? `${g.bookChapter}:${minVerse}`
            : `${g.bookChapter}:${minVerse}-${maxVerse}`,
        contents: g.contents,
        notes: g.notes,
      };
    });
  }

  async updatePrecept(
    userId: string,
    preceptId: string,
    dto: UpdatePreceptDto,
  ) {
    if (!dto.reference && !dto.content) {
      throw new BadRequestException("Nothing to update");
    }

    const precept = await this.prisma.precept.findUnique({
      where: { id: preceptId },
      include: {
        topic: true,
      },
    });

    if (!precept) {
      throw new NotFoundException("Precept not found");
    }

    if (precept.topic.userId !== userId) {
      throw new ForbiddenException("Not allowed to update this precept");
    }

    const updatedPrecept = await this.prisma.precept.update({
      where: { id: preceptId },
      data: {
        reference: dto.reference,
        content: dto.content,
      },
    });

    return {
      message: "Precept updated successfully",
      precept: updatedPrecept,
    };
  }
}
