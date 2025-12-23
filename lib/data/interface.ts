
import { User, Card, CardSlide, Reaction } from "@prisma/client"

export interface IDataService {
  // User operations
  createUser(data: Partial<User>): Promise<User>
  findUserByEmail(email: string): Promise<User | null>
  findUserByUsername(username: string): Promise<User | null>
  findUserByPhone(phoneNumber: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>

  // Card operations
  createCard(data: any): Promise<Card>
  getCard(id: string): Promise<any | null>
  getUserCards(userId: string): Promise<any[]>
  incrementCardViews(id: string): Promise<void>
  
  // Reaction operations
  addReaction(data: { cardId: string, type: string }): Promise<void>
}
