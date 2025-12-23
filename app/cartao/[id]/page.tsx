"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getCard, incrementCardViews } from "@/lib/card-service"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { Heart, Share2, Copy, MessageCircle, Sparkles } from "lucide-react"
import type { Card } from "@/types/card"

export default function ViewCardPage() {
  const params = useParams()
  const { toast } = useToast()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchCard() {
      if (params.id) {
        try {
          // @ts-ignore
          const cardData = await getCard(params.id as string)
          if (cardData) {
            // @ts-ignore
            setCard(cardData)
            // Incrementar views apenas uma vez
            incrementCardViews(params.id as string)
          } else {
            setError(true)
          }
        } catch (err) {
          console.error(err)
          setError(true)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCard()
  }, [params.id])

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Um cartão especial para você',
          text: 'Recebi este cartão de encorajamento e lembrei de você.',
          url: url,
        })
      } catch (err) {
        console.log('Erro ao compartilhar nativamente', err)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copiado!",
      description: "O link do cartão foi copiado para sua área de transferência.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Cartão não encontrado</h1>
        <p className="text-muted-foreground mb-8">Este cartão pode ter sido removido ou o link está incorreto.</p>
        <Link href="/">
          <Button>Voltar para o Início</Button>
        </Link>
      </div>
    )
  }

  // @ts-ignore - Campos extras que podem vir do Firestore
  const { fontSize = 24, textAlign = 'center' } = card

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background flex flex-col">
      <header className="p-4 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-serif text-lg font-bold">Encoraja</span>
        </Link>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div 
            className="relative aspect-[4/5] shadow-2xl rounded-xl overflow-hidden"
            style={{
              backgroundColor: card.backgroundColor || '#ffffff',
              backgroundImage: card.backgroundUrl ? `url(${card.backgroundUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay */}
            {card.backgroundUrl && <div className="absolute inset-0 bg-black/20" />}
            
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center h-full z-10">
              <p 
                className={`${card.fontFamily} leading-relaxed break-words w-full`}
                style={{ 
                  color: card.textColor,
                  fontSize: `${fontSize}px`,
                  textAlign: textAlign,
                  textShadow: card.backgroundUrl ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                {card.message}
              </p>
              <p 
                className="mt-8 text-sm font-medium opacity-90"
                style={{ color: card.textColor }}
              >
                — {card.author}
              </p>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-4 right-4 opacity-60 z-10">
              <span className="text-[10px] font-serif text-white drop-shadow-md">Encoraja.app</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <div className="flex gap-4 w-full">
            <Button onClick={handleShare} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button onClick={handleCopyLink} variant="outline" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center space-y-2 mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm w-full">
            <h3 className="font-serif text-xl text-foreground">Gostou da mensagem?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Crie sua própria corrente de encorajamento e faça o dia de alguém mais feliz.
            </p>
            <Link href="/criar" className="block w-full">
              <Button variant="secondary" className="w-full">
                <Heart className="w-4 h-4 mr-2 text-primary" />
                Criar um Cartão Agora
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Encoraja - Um abraço que se espalha</p>
      </footer>
    </div>
  )
}
