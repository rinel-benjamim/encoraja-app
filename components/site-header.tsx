"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function SiteHeader() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const user = session?.user

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/encoraja-logo.png"
            alt="Encoraja Logo"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#como-funciona"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Como Funciona
          </Link>
          <Link href="#sobre" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Sobre
          </Link>
          
          {!loading && (
            <>
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Minha Conta
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
              )}
            </>
          )}

          <Link href="/criar">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Criar Cartão
            </Button>
          </Link>
        </nav>
        <div className="md:hidden">
          <Link href="/criar">
            <Button size="sm">Criar Cartão</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
