"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

// Simple in-memory storage for Vercel demo (non-persistent)
const memoryStore: Record<string, string> = {}

export async function uploadFile(formData: FormData): Promise<string> {
  const file = formData.get("file") as File
  if (!file) {
    throw new Error("Nenhum arquivo enviado")
  }

  // Validar tipo
  const allowedTypes = ["image/", "video/", "audio/"]
  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    throw new Error("Tipo de arquivo não suportado. Use imagens, vídeos ou áudio.")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileExtension = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExtension}`

  // Check if running in Vercel production
  const isVercel = process.env.VERCEL === '1'
  
  if (isVercel) {
    // Return Base64 data URI for immediate display (Not persistent but works for demo)
    // Warning: Heavy payload for large files
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    return `data:${mimeType};base64,${base64}`
  }

  // Local filesystem storage (Dev mode)
  try {
    const uploadDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Ignore if exists
    }

    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    return `/uploads/${fileName}`
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error)
    throw new Error("Falha no upload do arquivo")
  }
}

export const uploadImage = uploadFile // Alias for backward compatibility
