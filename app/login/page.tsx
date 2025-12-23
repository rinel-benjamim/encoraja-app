"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { registerUser } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Heart } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha incorretos.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Ocorreu um erro ao fazer login.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (signupPassword !== signupConfirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (signupPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", signupEmail)
      formData.append("password", signupPassword)
      
      await registerUser(formData)
      
      // Auto login after signup
      const result = await signIn("credentials", {
        email: signupEmail,
        password: signupPassword,
        redirect: false,
      })

      if (result?.error) {
        setError("Conta criada, mas erro ao fazer login automático.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Erro ao criar conta.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <Image
              src="/images/encoraja-logo.png"
              alt="Encoraja Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
          <div className="text-center">
            <h1 className="font-serif text-3xl text-foreground">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-2">Entre para continuar espalhando esperança</p>
          </div>
        </div>

        <Card className="border-2 border-primary/10">
          <CardHeader className="pb-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="login-email">Email</FieldLabel>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </Field>
                  </FieldGroup>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="signup-password">Senha</FieldLabel>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                      <FieldDescription>Mínimo de 6 caracteres</FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="signup-confirm-password">Confirmar Senha</FieldLabel>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </Field>
                  </FieldGroup>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Criar Conta
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
