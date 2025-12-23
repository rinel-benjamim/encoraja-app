
import { IDataService } from "./interface"
import { prisma } from "@/lib/db"
import { User, Card } from "@prisma/client"

export class PrismaDataService implements IDataService {
  async createUser(data: any): Promise<User> {
    return prisma.user.create({ data })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } })
  }

  async findUserByPhone(phoneNumber: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { phoneNumber } })
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async createCard(data: any): Promise<Card> {
    return prisma.card.create({ data })
  }

  async getCard(id: string): Promise<any | null> {
    return prisma.card.findUnique({
      where: { id },
      include: {
        slides: { orderBy: { order: 'asc' } },
        reactions: true
      }
    })
  }

  async getUserCards(userId: string): Promise<any[]> {
    return prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        slides: true,
        reactions: true
      }
    })
  }

  async incrementCardViews(id: string): Promise<void> {
    await prisma.card.update({
      where: { id },
      data: { views: { increment: 1 } }
    })
  }

  async addReaction(data: { cardId: string, type: string }): Promise<void> {
    await prisma.reaction.create({ data })
  }
}
