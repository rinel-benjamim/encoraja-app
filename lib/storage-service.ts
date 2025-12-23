"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function uploadFile(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("Nenhum arquivo enviado")
    }

    // Validar tamanho (Removido limite de 10MB conforme solicitado)
    // if (file.size > 10 * 1024 * 1024) {
    //   throw new Error("O arquivo deve ter no máximo 10MB.")
    // }

    // Validar tipo
    const allowedTypes = ["image/", "video/", "audio/"]
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      throw new Error("Tipo de arquivo não suportado. Use imagens, vídeos ou áudio.")
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Ignore if exists
    }

    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    return `/uploads/${fileName}`
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error)
    throw new Error("Falha no upload do arquivo")
  }
}

export const uploadImage = uploadFile // Alias for backward compatibility
