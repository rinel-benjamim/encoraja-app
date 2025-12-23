"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Card } from "@/types/card"

export async function createCard(cardData: any) {
  console.log("Creating card with data:", JSON.stringify(cardData, null, 2))
  try {
    const card = await prisma.card.create({
      data: {
        userId: cardData.userId,
        author: cardData.author,
        message: cardData.message, // Legacy support or first slide
        backgroundUrl: cardData.backgroundUrl,
        backgroundColor: cardData.backgroundColor,
        fontFamily: cardData.fontFamily,
        textColor: cardData.textColor,
        fontSize: cardData.fontSize || 24,
        textAlign: cardData.textAlign || "center",
        isPublic: cardData.isPublic,
        
        // New Features
        audioUrl: cardData.audioUrl,
        videoUrl: cardData.videoUrl,
        revealAt: cardData.revealAt && cardData.revealAt !== "" ? new Date(cardData.revealAt) : null,
        themeId: cardData.themeId,
        
        // Slides
        slides: {
          create: cardData.slides?.map((slide: any, index: number) => ({
            content: slide.content,
            mediaUrl: slide.mediaUrl,
            mediaType: slide.mediaType,
            backgroundUrl: slide.backgroundUrl,
            backgroundColor: slide.backgroundColor,
            fontFamily: slide.fontFamily,
            textColor: slide.textColor,
            fontSize: slide.fontSize,
            textAlign: slide.textAlign,
            order: index,
          })) || []
        }
      },
    })
    
    revalidatePath("/dashboard")
    return card.id
  } catch (error) {
    console.error("Erro ao criar cartão:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    throw new Error("Falha ao criar cartão")
  }
}

export async function getCard(id: string) {
  try {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: { order: 'asc' }
        },
        reactions: true
      }
    })
    
    if (!card) return null

    return {
      ...card,
      createdAt: card.createdAt.getTime(), // Convert Date to number for client compatibility
      revealAt: card.revealAt ? card.revealAt.getTime() : null,
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
      include: {
        slides: true,
        reactions: true
      }
    })
    
    return cards.map(card => ({
      ...card,
      createdAt: card.createdAt.getTime(),
      revealAt: card.revealAt ? card.revealAt.getTime() : null,
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

export async function addReaction(cardId: string, type: string) {
  try {
    await prisma.reaction.create({
      data: {
        cardId,
        type,
      }
    })
    revalidatePath(`/cartao/${cardId}`)
  } catch (error) {
    console.error("Erro ao adicionar reação:", error)
  }
}

