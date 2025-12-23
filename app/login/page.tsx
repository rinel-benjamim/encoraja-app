"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { registerUser, generateUsernameSuggestions, checkUsername } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Heart, RefreshCw } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")
  const [signupUsername, setSignupUsername] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([])
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: loginIdentifier,
        password: loginPassword,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciais inválidas.")
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

  const handleCheckUsername = async () => {
    if (!signupUsername) return
    setIsCheckingUsername(true)
    try {
      const exists = await checkUsername(signupUsername)
      if (exists) {
        const suggestions = await generateUsernameSuggestions(signupUsername)
        setUsernameSuggestions(suggestions)
        setError("Nome de usuário já existe. Tente uma das sugestões abaixo.")
      } else {
        setUsernameSuggestions([])
        setError("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsCheckingUsername(false)
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
      formData.append("username", signupUsername)
      formData.append("phoneNumber", signupPhone)
      
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
                      <FieldLabel htmlFor="login-identifier">Email ou Telefone</FieldLabel>
                      <Input
                        id="login-identifier"
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="seu@email.com ou número"
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
                      <FieldLabel htmlFor="signup-username">Nome de Usuário</FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          id="signup-username"
                          type="text"
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          onBlur={handleCheckUsername}
                          placeholder="usuario123"
                          required
                          disabled={isLoading}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={handleCheckUsername} disabled={isCheckingUsername}>
                          {isCheckingUsername ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                        </Button>
                      </div>
                      {usernameSuggestions.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground mb-1">Sugestões:</p>
                          <div className="flex flex-wrap gap-2">
                            {usernameSuggestions.map((suggestion) => (
                              <Button
                                key={suggestion}
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setSignupUsername(suggestion)
                                  setUsernameSuggestions([])
                                  setError("")
                                }}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Field>

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
                      <FieldLabel htmlFor="signup-phone">Telefone (Opcional)</FieldLabel>
                      <Input
                        id="signup-phone"
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+55 11 99999-9999"
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
