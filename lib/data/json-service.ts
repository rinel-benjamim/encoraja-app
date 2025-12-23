
import { IDataService } from "./interface"
import { v4 as uuidv4 } from "uuid"

// In-memory store for Vercel serverless environment
// Note: This data will be lost on re-deploy or cold start
// Ideally this should sync to an external JSON store like Vercel KV or Blob
// But for "JSON file" request in read-only env, memory is the only writable place without external service
// We will try to read from a detailed JSON object if provided via ENV, otherwise memory

let store = {
  users: [] as any[],
  cards: [] as any[],
  slides: [] as any[],
  reactions: [] as any[]
}

export class JsonDataService implements IDataService {
  constructor() {
    console.log("Initializing JsonDataService (In-Memory for Vercel)")
  }

  private async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  async createUser(data: any): Promise<any> {
    await this.simulateDelay()
    const newUser = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    store.users.push(newUser)
    return newUser
  }

  async findUserByEmail(email: string): Promise<any | null> {
    await this.simulateDelay()
    return store.users.find(u => u.email === email) || null
  }

  async findUserByUsername(username: string): Promise<any | null> {
    await this.simulateDelay()
    return store.users.find(u => u.username === username) || null
  }

  async findUserByPhone(phoneNumber: string): Promise<any | null> {
    await this.simulateDelay()
    return store.users.find(u => u.phoneNumber === phoneNumber) || null
  }

  async findUserById(id: string): Promise<any | null> {
    await this.simulateDelay()
    return store.users.find(u => u.id === id) || null
  }

  async createCard(data: any): Promise<any> {
    await this.simulateDelay()
    
    // Handle nested creates manually
    const cardId = uuidv4()
    const newCard = {
      id: cardId,
      ...data,
      slides: undefined, // Remove nested for flat storage
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    }

    // Process slides
    if (data.slides && data.slides.create) {
      data.slides.create.forEach((slide: any) => {
        store.slides.push({
          id: uuidv4(),
          cardId: cardId,
          ...slide
        })
      })
    }

    store.cards.push(newCard)
    return newCard
  }

  async getCard(id: string): Promise<any | null> {
    await this.simulateDelay()
    const card = store.cards.find(c => c.id === id)
    if (!card) return null

    const slides = store.slides.filter(s => s.cardId === id).sort((a, b) => a.order - b.order)
    const reactions = store.reactions.filter(r => r.cardId === id)

    return {
      ...card,
      slides,
      reactions
    }
  }

  async getUserCards(userId: string): Promise<any[]> {
    await this.simulateDelay()
    const cards = store.cards.filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return cards.map(card => {
      const slides = store.slides.filter(s => s.cardId === card.id)
      const reactions = store.reactions.filter(r => r.cardId === card.id)
      return { ...card, slides, reactions }
    })
  }

  async incrementCardViews(id: string): Promise<void> {
    await this.simulateDelay()
    const card = store.cards.find(c => c.id === id)
    if (card) {
      card.views = (card.views || 0) + 1
    }
  }

  async addReaction(data: { cardId: string, type: string }): Promise<void> {
    await this.simulateDelay()
    store.reactions.push({
      id: uuidv4(),
      ...data,
      createdAt: new Date()
    })
  }
}
