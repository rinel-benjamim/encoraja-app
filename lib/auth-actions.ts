"use server"

import { getDataService } from "@/lib/data/factory"
import bcrypt from "bcryptjs"

const dataService = getDataService()

export async function checkUsername(username: string) {
  const user = await dataService.findUserByUsername(username)
  return !!user
}

export async function generateUsernameSuggestions(base: string) {
  const suggestions: string[] = []
  let attempts = 0
  
  while (suggestions.length < 3 && attempts < 10) {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const suggestion = `${base}${randomSuffix}`
    const exists = await checkUsername(suggestion)
    if (!exists && !suggestions.includes(suggestion)) {
      suggestions.push(suggestion)
    }
    attempts++
  }
  
  return suggestions
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const username = formData.get("username") as string
  const phoneNumber = formData.get("phoneNumber") as string

  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios")
  }

  // Check if email exists
  const existingEmail = await dataService.findUserByEmail(email)

  if (existingEmail) {
    throw new Error("Email já cadastrado")
  }

  // Check if username exists
  if (username) {
    const existingUsername = await dataService.findUserByUsername(username)
    if (existingUsername) {
      throw new Error("Nome de usuário já está em uso")
    }
  }

  // Check if phone exists
  if (phoneNumber) {
    const existingPhone = await dataService.findUserByPhone(phoneNumber)
    if (existingPhone) {
      throw new Error("Número de telefone já cadastrado")
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await dataService.createUser({
    email,
    password: hashedPassword,
    name: name || email.split("@")[0],
    username: username || undefined,
    phoneNumber: phoneNumber || undefined,
  })

  return { success: true }
}
