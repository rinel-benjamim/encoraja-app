"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Sparkles, Send, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true

    if (isStandalone) {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              Um abraço que se espalha
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-balance leading-tight text-foreground">
              Espalhe esperança com um <span className="text-primary">cartão digital</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Crie cartões personalizados com mensagens fortalecedoras e motivacionais. Compartilhe amor, esperança e
              encorajamento para ajudar alguém a se sentir melhor hoje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/criar">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-base"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Criar Meu Cartão Agora
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-transparent">
                  Ver Como Funciona
                </Button>
              </Link>
            </div>
          </div>

          {/* Example Card Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full" />
            <Card className="relative overflow-hidden shadow-2xl border-2 border-primary/20">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 via-secondary/30 to-accent/10 p-8 flex flex-col justify-center items-center text-center">
                <div className="space-y-6">
                  <Heart className="w-16 h-16 text-primary mx-auto animate-pulse" />
                  <h3 className="font-serif text-3xl md:text-4xl text-balance text-foreground">
                    Você é mais forte do que imagina
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                    Mesmo nos dias difíceis, lembre-se: esta tempestade vai passar, e você vai brilhar ainda mais forte.
                  </p>
                  <div className="pt-4 text-sm text-muted-foreground italic">Com carinho, um amigo</div>
                </div>
              </div>
            </Card>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/30 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/30 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-balance text-foreground mb-4">Como Funciona</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Criar e compartilhar esperança nunca foi tão simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground">1. Personalize</h3>
              <p className="text-muted-foreground leading-relaxed">
                Escolha um fundo bonito, adicione sua mensagem motivacional e personalize com fotos ou frases prontas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/10 hover:border-accent/30 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-xl text-foreground">2. Compartilhe</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gere um link único e compartilhe via WhatsApp, email ou redes sociais com quem precisa de um abraço
                virtual.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif text-xl text-foreground">3. Espalhe Amor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quem recebe pode criar um novo cartão inspirado no seu, criando uma corrente de encorajamento.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section
        id="sobre"
        className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-balance text-foreground">
            Um abraço virtual quando mais precisamos
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Às vezes, uma simples mensagem de encorajamento pode mudar o dia de alguém. O Encoraja foi criado para
            facilitar esse gesto de carinho, permitindo que você crie cartões digitais bonitos e significativos para
            compartilhar esperança, força e amor com quem precisa.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pequenos gestos têm grande poder. Quando tiramos o foco dos nossos próprios problemas para ajudar alguém,
            criamos uma corrente positiva que transforma vidas.
          </p>
          <div className="pt-6">
            <Link href="/criar">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Heart className="w-5 h-5 mr-2" />
                Comece a Encorajar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/encoraja-logo.png"
                alt="Encoraja Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Encoraja. Espalhando esperança, um cartão de cada vez.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
