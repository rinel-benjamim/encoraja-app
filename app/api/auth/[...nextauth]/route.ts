import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getDataService } from "@/lib/data/factory"
import bcrypt from "bcryptjs"

const dataService = getDataService()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Allow login with email or phone number
        // We need to implement findUserByEmailOrPhone in interface or check both
        let user = await dataService.findUserByEmail(credentials.email)
        if (!user) {
          user = await dataService.findUserByPhone(credentials.email)
        }

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.sub
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
