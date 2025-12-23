"use client"

import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function HeroCardPreview() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full animate-pulse" />
      <Card className="relative overflow-hidden shadow-2xl border-2 border-primary/20 transition-transform hover:scale-105 duration-300">
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
    </div>
  )
}
