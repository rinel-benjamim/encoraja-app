"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { createCard } from "@/lib/card-service"
import { uploadImage } from "@/lib/storage-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Layout, 
  Save, 
  ArrowLeft, 
  Upload,
  Check
} from "lucide-react"
import { FONT_OPTIONS, COLOR_OPTIONS } from "@/types/card"

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", // Natureza
  "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=800&q=80", // Céu
  "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&w=800&q=80", // Flores
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80", // Mar
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", // Praia
]

const SUGGESTED_MESSAGES = [
  "Você é mais forte do que imagina.",
  "Acredite em si mesmo e tudo será possível.",
  "Dias melhores virão. Mantenha a esperança.",
  "Sua luz ilumina o mundo. Não deixe ela apagar.",
  "Um passo de cada vez. Você vai chegar lá.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Não desista, o início é sempre a parte mais difícil.",
  "Você é capaz de coisas incríveis.",
]

export default function CreateCardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Card State
  const [message, setMessage] = useState("Sua mensagem aqui...")
  const [author, setAuthor] = useState("")
  const [backgroundUrl, setBackgroundUrl] = useState<string | undefined>(BACKGROUND_IMAGES[0])
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [fontFamily, setFontFamily] = useState("font-serif")
  const [textColor, setTextColor] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(24)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center")

  useEffect(() => {
    if (session?.user) {
      setAuthor(session.user.name || session.user.email?.split("@")[0] || "Anônimo")
    }
  }, [session])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const url = await uploadImage(formData)
      setBackgroundUrl(url)
      toast({
        title: "Imagem enviada!",
        description: "Sua imagem foi carregada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, escreva uma mensagem para o cartão.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // @ts-ignore
      const userId = session?.user?.id

      const cardId = await createCard({
        userId: userId,
        author,
        message,
        backgroundUrl,
        backgroundColor,
        fontFamily,
        textColor,
        isPublic: true,
        // @ts-ignore - Adicionando campos extras de estilo que não estavam na interface original mas são úteis
        fontSize,
        textAlign,
      })

      toast({
        title: "Cartão criado!",
        description: "Seu cartão foi criado com sucesso.",
      })

      router.push(`/cartao/${cardId}`)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao criar",
        description: "Ocorreu um erro ao salvar seu cartão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-serif text-xl font-bold text-foreground">Criar Cartão</h1>
          </div>
          <Button onClick={handleSave} disabled={loading || uploading} className="bg-primary text-primary-foreground">
            {loading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar e Compartilhar
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Preview Area */}
        <div className="flex items-center justify-center bg-secondary/10 rounded-3xl p-8 min-h-[500px]">
          <div 
            className="relative w-full max-w-md aspect-[4/5] shadow-2xl rounded-xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: backgroundColor,
              backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay para legibilidade se tiver imagem */}
            {backgroundUrl && <div className="absolute inset-0 bg-black/20" />}
            
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center h-full z-10">
              <p 
                className={`${fontFamily} leading-relaxed break-words w-full`}
                style={{ 
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  textAlign: textAlign,
                  textShadow: backgroundUrl ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                {message}
              </p>
              <p 
                className="mt-6 text-sm font-medium opacity-80"
                style={{ color: textColor }}
              >
                — {author}
              </p>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-4 right-4 opacity-50 z-10">
              <span className="text-[10px] font-serif text-white drop-shadow-md">Encoraja.app</span>
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2">
          <Tabs defaultValue="message" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="message"><Type className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="background"><ImageIcon className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="style"><Palette className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="layout"><Layout className="w-4 h-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-4">
              <div className="space-y-2">
                <Label>Sua Mensagem</Label>
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva algo encorajador..."
                  className="min-h-[120px] text-lg"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">{message.length}/300</p>
              </div>

              <div className="space-y-2">
                <Label>Assinado por</Label>
                <Input 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>

              <div className="space-y-2">
                <Label>Sugestões</Label>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_MESSAGES.slice(0, 4).map((msg, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-auto py-2 text-left whitespace-normal"
                      onClick={() => setMessage(msg)}
                    >
                      {msg}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <div className="space-y-2">
                <Label>Imagens da Galeria</Label>
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUND_IMAGES.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setBackgroundUrl(url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${backgroundUrl === url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-primary/50'}`}
                    >
                      <Image 
                        src={url} 
                        alt="Background option" 
                        fill 
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                  <button
                    onClick={() => setBackgroundUrl(undefined)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 flex items-center justify-center bg-muted transition-all ${!backgroundUrl ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <span className="text-xs text-muted-foreground">Sem Imagem</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Próprio</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Spinner className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                    Carregar Imagem
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Máximo 5MB. JPG ou PNG.</p>
              </div>

              <div className="space-y-2">
                <Label>Cor de Fundo (se sem imagem)</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setBackgroundColor(color.value)
                        setBackgroundUrl(undefined)
                      }}
                      className={`w-8 h-8 rounded-full border border-border transition-transform hover:scale-110 ${backgroundColor === color.value && !backgroundUrl ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value)
                      setBackgroundUrl(undefined)
                    }}
                    className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <div className="space-y-2">
                <Label>Fonte</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor do Texto</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setTextColor(color.value)}
                      className={`w-8 h-8 rounded-full border border-border transition-transform hover:scale-110 ${textColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <div className="space-y-2">
                <Label>Tamanho da Fonte: {fontSize}px</Label>
                <Slider 
                  value={[fontSize]} 
                  min={12} 
                  max={48} 
                  step={1} 
                  onValueChange={(vals) => setFontSize(vals[0])} 
                />
              </div>

              <div className="space-y-2">
                <Label>Alinhamento</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={textAlign === "left" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setTextAlign("left")}
                    className="flex-1"
                  >
                    Esquerda
                  </Button>
                  <Button 
                    variant={textAlign === "center" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setTextAlign("center")}
                    className="flex-1"
                  >
                    Centro
                  </Button>
                  <Button 
                    variant={textAlign === "right" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setTextAlign("right")}
                    className="flex-1"
                  >
                    Direita
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
