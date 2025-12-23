import { storage } from "./firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"

export async function uploadImage(file: File, path: string = "uploads"): Promise<string> {
  try {
    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 5MB.")
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      throw new Error("O arquivo deve ser uma imagem.")
    }

    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const storageRef = ref(storage, `${path}/${fileName}`)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error)
    throw error
  }
}
