"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios")
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("Email já cadastrado")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
    },
  })

  return { success: true }
}
