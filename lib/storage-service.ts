"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function uploadImage(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("Nenhum arquivo enviado")
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 5MB.")
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      throw new Error("O arquivo deve ser uma imagem.")
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
    console.error("Erro ao fazer upload da imagem:", error)
    throw new Error("Falha no upload da imagem")
  }
}
