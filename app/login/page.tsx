"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Heart } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

  // Reset password state
  const [resetEmail, setResetEmail] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn(loginEmail, loginPassword)
      router.push("/dashboard")
    } catch (err: unknown) {
      console.error("[v0] Login error:", err)
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais."

      if (err instanceof Error) {
        // Check for specific Firebase errors
        if (err.message.includes("configuration-not-found")) {
          errorMessage =
            "Erro de configuração do Firebase. Verifique se as variáveis de ambiente estão configuradas corretamente na seção 'Vars' da barra lateral."
        } else if (err.message.includes("invalid-credential") || err.message.includes("wrong-password")) {
          errorMessage = "Email ou senha incorretos. Tente novamente."
        } else if (err.message.includes("user-not-found")) {
          errorMessage = "Usuário não encontrado. Crie uma conta primeiro."
        } else if (err.message.includes("too-many-requests")) {
          errorMessage = "Muitas tentativas de login. Tente novamente mais tarde."
        } else if (err.message.includes("network-request-failed")) {
          errorMessage = "Erro de conexão. Verifique sua internet."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
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
      await signUp(signupEmail, signupPassword)
      router.push("/dashboard")
    } catch (err: unknown) {
      console.error("[v0] Signup error:", err)
      let errorMessage = "Erro ao criar conta. Tente novamente."

      if (err instanceof Error) {
        // Check for specific Firebase errors
        if (err.message.includes("configuration-not-found")) {
          errorMessage =
            "Erro de configuração do Firebase. Verifique se as variáveis de ambiente estão configuradas corretamente na seção 'Vars' da barra lateral."
        } else if (err.message.includes("email-already-in-use")) {
          errorMessage = "Este email já está em uso. Faça login ou use outro email."
        } else if (err.message.includes("invalid-email")) {
          errorMessage = "Email inválido. Verifique o formato."
        } else if (err.message.includes("weak-password")) {
          errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres."
        } else if (err.message.includes("network-request-failed")) {
          errorMessage = "Erro de conexão. Verifique sua internet."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResetEmailSent(false)
    setIsLoading(true)

    try {
      await resetPassword(resetEmail)
      setResetEmailSent(true)
      setResetEmail("")
    } catch (err: unknown) {
      console.error("[v0] Reset password error:", err)
      let errorMessage = "Erro ao enviar email de recuperação."

      if (err instanceof Error) {
        // Check for specific Firebase errors
        if (err.message.includes("configuration-not-found")) {
          errorMessage =
            "Erro de configuração do Firebase. Verifique se as variáveis de ambiente estão configuradas corretamente na seção 'Vars' da barra lateral."
        } else if (err.message.includes("user-not-found")) {
          errorMessage = "Email não encontrado. Verifique o endereço."
        } else if (err.message.includes("invalid-email")) {
          errorMessage = "Email inválido. Verifique o formato."
        } else if (err.message.includes("network-request-failed")) {
          errorMessage = "Erro de conexão. Verifique sua internet."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
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
                      <FieldDescription>
                        <Link href="#reset" className="text-primary hover:underline text-sm">
                          Esqueceu sua senha?
                        </Link>
                      </FieldDescription>
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

        <Card className="border-2 border-border/50" id="reset">
          <CardHeader>
            <CardTitle className="text-lg">Recuperar Senha</CardTitle>
            <CardDescription>Digite seu email para receber instruções de recuperação</CardDescription>
          </CardHeader>
          <CardContent>
            {resetEmailSent && (
              <Alert className="mb-4">
                <AlertDescription>Email de recuperação enviado! Verifique sua caixa de entrada.</AlertDescription>
              </Alert>
            )}
            {error && !resetEmailSent && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </Field>
              <Button type="submit" variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Email de Recuperação"
                )}
              </Button>
            </form>
          </CardContent>
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
