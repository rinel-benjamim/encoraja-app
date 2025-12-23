"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Card } from "@/types/card"

export async function createCard(cardData: Omit<Card, "id" | "createdAt" | "views" | "updatedAt">) {
  try {
    const card = await prisma.card.create({
      data: {
        userId: cardData.userId,
        author: cardData.author,
        message: cardData.message,
        backgroundUrl: cardData.backgroundUrl,
        backgroundColor: cardData.backgroundColor,
        fontFamily: cardData.fontFamily,
        textColor: cardData.textColor,
        // @ts-ignore
        fontSize: cardData.fontSize || 24,
        // @ts-ignore
        textAlign: cardData.textAlign || "center",
        isPublic: cardData.isPublic,
      },
    })
    
    revalidatePath("/dashboard")
    return card.id
  } catch (error) {
    console.error("Erro ao criar cartão:", error)
    throw new Error("Falha ao criar cartão")
  }
}

export async function getCard(id: string) {
  try {
    const card = await prisma.card.findUnique({
      where: { id },
    })
    
    if (!card) return null

    return {
      ...card,
      createdAt: card.createdAt.getTime(), // Convert Date to number for client compatibility
    }
  } catch (error) {
    console.error("Erro ao buscar cartão:", error)
    return null
  }
}

export async function getUserCards(userId: string) {
  try {
    const cards = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    
    return cards.map(card => ({
      ...card,
      createdAt: card.createdAt.getTime(),
    }))
  } catch (error) {
    console.error("Erro ao buscar cartões do usuário:", error)
    return []
  }
}

export async function incrementCardViews(id: string) {
  try {
    await prisma.card.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error("Erro ao incrementar visualizações:", error)
  }
}
