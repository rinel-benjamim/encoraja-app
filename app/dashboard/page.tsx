"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getUserCards } from "@/lib/card-service"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Calendar, ExternalLink } from "lucide-react"
import type { Card as CardType } from "@/types/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DashboardPage() {
  const { user } = useAuth()
  const [cards, setCards] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCards() {
      if (user) {
        try {
          const userCards = await getUserCards(user.uid)
          setCards(userCards)
        } catch (error) {
          console.error("Erro ao carregar cartões:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCards()
  }, [user])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold text-primary">
              Encoraja
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Olá, {user?.email?.split("@")[0]}
              </span>
              <Link href="/criar">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cartão
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl text-foreground">Meus Cartões</h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-16 bg-secondary/10 rounded-3xl border-2 border-dashed border-secondary/30">
              <h3 className="font-serif text-xl text-foreground mb-2">Você ainda não criou nenhum cartão</h3>
              <p className="text-muted-foreground mb-6">
                Comece agora a espalhar esperança e encorajamento.
              </p>
              <Link href="/criar">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Criar Meu Primeiro Cartão
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-border/50">
                  <div 
                    className="aspect-[4/3] bg-cover bg-center relative group"
                    style={{ 
                      backgroundImage: card.backgroundUrl ? `url(${card.backgroundUrl})` : undefined,
                      backgroundColor: card.backgroundColor || '#f3f4f6'
                    }}
                  >
                    {!card.backgroundUrl && (
                      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <p className={`text-sm line-clamp-4 ${card.textColor || 'text-foreground'} ${card.fontFamily}`}>
                          {card.message}
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <Link href={`/cartao/${card.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" className="shadow-lg">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                    </Link>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 font-medium">
                      {card.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(card.createdAt, "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/20 px-4 py-3 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {card.views} visualizações
                    </div>
                    <Link href={`/cartao/${card.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Abrir <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
