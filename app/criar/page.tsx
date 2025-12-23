"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { createCard } from "@/lib/card-service"
import { uploadFile } from "@/lib/storage-service"
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
  Check,
  Plus,
  Trash2,
  Music,
  Video,
  Calendar,
  Sparkles,
  QrCode,
  ChevronLeft,
  ChevronRight,
  X
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

const AI_CATEGORIES = ["Motivação", "Teocrático", "Amor", "Gratidão", "Superação"]

export default function CreateCardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Card State
  const [slides, setSlides] = useState([{ 
    content: "Sua mensagem aqui...", 
    mediaUrl: "", 
    mediaType: "image",
    backgroundUrl: BACKGROUND_IMAGES[0],
    backgroundColor: "#ffffff",
    fontFamily: "font-serif",
    textColor: "#ffffff",
    fontSize: 24,
    textAlign: "center" as "left" | "center" | "right"
  }])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [author, setAuthor] = useState("")
  
  // New Features State
  const [audioUrl, setAudioUrl] = useState<string | undefined>()
  const [videoUrl, setVideoUrl] = useState<string | undefined>()
  const [revealAt, setRevealAt] = useState<string>("")
  const [showQRCode, setShowQRCode] = useState(false)

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
      
      const url = await uploadFile(formData)
      updateSlideState('backgroundUrl', url)
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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const url = await uploadFile(formData)
      if (type === 'audio') setAudioUrl(url)
      else setVideoUrl(url)
      
      toast({
        title: "Mídia enviada!",
        description: `Seu ${type === 'audio' ? 'áudio' : 'vídeo'} foi carregado com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const addSlide = () => {
    setSlides([...slides, { 
      content: "Nova mensagem...", 
      mediaUrl: "", 
      mediaType: "image",
      backgroundUrl: BACKGROUND_IMAGES[0],
      backgroundColor: "#ffffff",
      fontFamily: "font-serif",
      textColor: "#ffffff",
      fontSize: 24,
      textAlign: "center"
    }])
    setCurrentSlideIndex(slides.length)
  }

  const removeSlide = (index: number) => {
    if (slides.length === 1) return
    const newSlides = slides.filter((_, i) => i !== index)
    setSlides(newSlides)
    setCurrentSlideIndex(Math.min(currentSlideIndex, newSlides.length - 1))
  }

  const updateSlideState = (key: string, value: any) => {
    const newSlides = [...slides]
    newSlides[currentSlideIndex] = {
      ...newSlides[currentSlideIndex],
      [key]: value
    }
    setSlides(newSlides)
  }

  const generateAIMessage = (category: string) => {
    let messages: string[] = []
    
    if (category === "Teocrático") {
      messages = [
        "Salmo 37:25: Fui jovem e agora sou velho, Mas nunca vi um justo abandonado Nem os seus filhos à procura de pão.",
        "Provérbios 10:3: Jeová não fará o justo passar fome, Mas negará aos maus o que eles cobiçam.",
        "Salmo 25:15, 16: Os meus olhos estão sempre voltados para Jeová, Pois ele libertará os meus pés da rede. Volta a tua face para mim e mostra-me favor, Pois estou sozinho e desamparado.",
        "Isaías 30:15: Pois assim diz o Soberano Senhor Jeová, o Santo de Israel: “Se voltarem para mim e ficarem tranquilos, serão salvos; A vossa força estará em permanecerem calmos e terem confiança.”",
        "Filipenses 4:13: Para todas as coisas tenho forças graças àquele que me dá poder.",
        "Jeremias 29:11: 'Pois eu sei muito bem o que tenho em mente para vocês', diz Jeová. 'Quero que tenham paz, não calamidade. Quero dar-lhes um futuro e uma esperança.'",
        "Salmo 55:22: Lança o teu fardo sobre Jeová, E ele amparar-te-á. Nunca permitirá que o justo caia.",
        "Isaías 41:10: Não tenhas medo, pois estou contigo. Não fiques ansioso, pois eu sou o teu Deus. Vou fortalecer-te, sim, vou ajudar-te. Vou segurar-te firmemente com a minha mão direita de justiça."
      ]
    } else {
      messages = [
        `Para ${category}: Acredite que cada dia traz uma nova oportunidade de vencer.`,
        `Em momentos de ${category}, lembre-se da sua força interior.`,
        `Que a ${category} encha seu coração de paz e alegria.`,
        `Você é um exemplo de ${category} para todos nós.`
      ]
    }
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    updateSlideState('content', randomMsg)
  }

  const resetCard = () => {
    if (confirm("Tem certeza que deseja limpar tudo?")) {
      setSlides([{ 
        content: "Sua mensagem aqui...", 
        mediaUrl: "", 
        mediaType: "image",
        backgroundUrl: BACKGROUND_IMAGES[0],
        backgroundColor: "#ffffff",
        fontFamily: "font-serif",
        textColor: "#ffffff",
        fontSize: 24,
        textAlign: "center"
      }])
      setCurrentSlideIndex(0)
      setAudioUrl(undefined)
      setVideoUrl(undefined)
      setRevealAt("")
    }
  }

  const prevSlide = () => {
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
  }

  const nextSlide = () => {
    setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))
  }

  const handleSave = async () => {
    if (!slides[0].content.trim()) {
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
        message: slides[0].content, // Fallback
        slides,
        backgroundUrl: slides[0].backgroundUrl, // Fallback
        backgroundColor: slides[0].backgroundColor, // Fallback
        fontFamily: slides[0].fontFamily, // Fallback
        textColor: slides[0].textColor, // Fallback
        isPublic: true,
        fontSize: slides[0].fontSize, // Fallback
        textAlign: slides[0].textAlign, // Fallback
        audioUrl,
        videoUrl,
        revealAt: revealAt || null,
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

  const currentSlide = slides[currentSlideIndex]

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
          <div className="flex gap-2">
            <Button variant="destructive" size="icon" onClick={resetCard} title="Limpar Cartão">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button onClick={handleSave} disabled={loading || uploading} className="bg-primary text-primary-foreground">
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Preview Area */}
        <div className="flex flex-col items-center justify-center bg-secondary/10 rounded-3xl p-8 min-h-[500px]">
          <div 
            className="relative w-full max-w-md aspect-[4/5] shadow-2xl rounded-xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: currentSlide.backgroundColor,
              backgroundImage: currentSlide.backgroundUrl ? `url(${currentSlide.backgroundUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay para legibilidade se tiver imagem */}
            {currentSlide.backgroundUrl && <div className="absolute inset-0 bg-black/20" />}
            
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center h-full z-10">
              {videoUrl && (
                <div className="w-full mb-4 aspect-video bg-black rounded-lg overflow-hidden">
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
                </div>
              )}
              
              <p 
                className={`${currentSlide.fontFamily} leading-relaxed break-words w-full`}
                style={{ 
                  color: currentSlide.textColor,
                  fontSize: `${currentSlide.fontSize}px`,
                  textAlign: currentSlide.textAlign,
                  textShadow: currentSlide.backgroundUrl ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                {currentSlide.content}
              </p>
              <p 
                className="mt-6 text-sm font-medium opacity-80"
                style={{ color: currentSlide.textColor }}
              >
                — {author}
              </p>
            </div>

            {/* Watermark */}
            <div className="absolute bottom-4 right-4 opacity-50 z-10">
              <span className="text-[10px] font-serif text-white drop-shadow-md">Encoraja.app</span>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex items-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlideIndex === 0} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentSlideIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'}`}
                />
              ))}
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8 ml-2" onClick={addSlide}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2">
          <Tabs defaultValue="message" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="message"><Type className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="background"><ImageIcon className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="style"><Palette className="w-4 h-4" /></TabsTrigger>
              {/* <TabsTrigger value="media"><Music className="w-4 h-4" /></TabsTrigger> */}
              <TabsTrigger value="extras"><Sparkles className="w-4 h-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Slide {currentSlideIndex + 1}</Label>
                {slides.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeSlide(currentSlideIndex)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-1" /> Remover Slide
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Sua Mensagem</Label>
                <Textarea 
                  value={currentSlide.content}
                  onChange={(e) => updateSlideState('content', e.target.value)}
                  placeholder="Escreva algo encorajador..."
                  className="min-h-[120px] text-lg"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">{currentSlide.content.length}/300</p>
              </div>

              <div className="space-y-2">
                <Label>Aleatório</Label>
                <div className="flex flex-wrap gap-2">
                  {AI_CATEGORIES.map(cat => (
                    <Button key={cat} variant="outline" size="sm" onClick={() => generateAIMessage(cat)}>
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assinado por</Label>
                <Input 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <div className="space-y-2">
                <Label>Imagens da Galeria</Label>
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUND_IMAGES.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => updateSlideState('backgroundUrl', url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentSlide.backgroundUrl === url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-primary/50'}`}
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
                    onClick={() => updateSlideState('backgroundUrl', undefined)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 flex items-center justify-center bg-muted transition-all ${!currentSlide.backgroundUrl ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-primary/50'}`}
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
                <p className="text-xs text-muted-foreground">Sem limite de tamanho. Imagens, Áudio ou Vídeo.</p>
              </div>

              <div className="space-y-2">
                <Label>Cor de Fundo (se sem imagem)</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        updateSlideState('backgroundColor', color.value)
                        updateSlideState('backgroundUrl', undefined)
                      }}
                      className={`w-8 h-8 rounded-full border border-border transition-transform hover:scale-110 ${currentSlide.backgroundColor === color.value && !currentSlide.backgroundUrl ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={currentSlide.backgroundColor}
                    onChange={(e) => {
                      updateSlideState('backgroundColor', e.target.value)
                      updateSlideState('backgroundUrl', undefined)
                    }}
                    className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <div className="space-y-2">
                <Label>Fonte</Label>
                <Select value={currentSlide.fontFamily} onValueChange={(val) => updateSlideState('fontFamily', val)}>
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
                      onClick={() => updateSlideState('textColor', color.value)}
                      className={`w-8 h-8 rounded-full border border-border transition-transform hover:scale-110 ${currentSlide.textColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={currentSlide.textColor}
                    onChange={(e) => updateSlideState('textColor', e.target.value)}
                    className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tamanho da Fonte: {currentSlide.fontSize}px</Label>
                <Slider 
                  value={[currentSlide.fontSize]} 
                  min={12} 
                  max={48} 
                  step={1} 
                  onValueChange={(vals) => updateSlideState('fontSize', vals[0])} 
                />
              </div>

              <div className="space-y-2">
                <Label>Alinhamento</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={currentSlide.textAlign === "left" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateSlideState('textAlign', "left")}
                    className="flex-1"
                  >
                    Esquerda
                  </Button>
                  <Button 
                    variant={currentSlide.textAlign === "center" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateSlideState('textAlign', "center")}
                    className="flex-1"
                  >
                    Centro
                  </Button>
                  <Button 
                    variant={currentSlide.textAlign === "right" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateSlideState('textAlign', "right")}
                    className="flex-1"
                  >
                    Direita
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Música de Fundo</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => audioInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Spinner className="mr-2 h-4 w-4" /> : <Music className="mr-2 h-4 w-4" />}
                      {audioUrl ? "Alterar Música" : "Adicionar Música"}
                    </Button>
                    {audioUrl && (
                      <Button variant="destructive" size="icon" onClick={() => setAudioUrl(undefined)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <input 
                      type="file" 
                      ref={audioInputRef}
                      className="hidden" 
                      accept="audio/*"
                      onChange={(e) => handleMediaUpload(e, 'audio')}
                    />
                  </div>
                  {audioUrl && <audio src={audioUrl} controls className="w-full mt-2 h-8" />}
                </div>

                <div className="space-y-2">
                  <Label>Vídeo (Slide Atual)</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Spinner className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                      {videoUrl ? "Alterar Vídeo" : "Adicionar Vídeo"}
                    </Button>
                    {videoUrl && (
                      <Button variant="destructive" size="icon" onClick={() => setVideoUrl(undefined)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <input 
                      type="file" 
                      ref={videoInputRef}
                      className="hidden" 
                      accept="video/*"
                      onChange={(e) => handleMediaUpload(e, 'video')}
                    />
                  </div>
                </div>
              </div>
            </TabsContent> */}

            <TabsContent value="extras" className="space-y-6">
              {/* <div className="space-y-2">
                <Label>Agendar Revelação</Label>
                <div className="flex gap-2 items-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="datetime-local" 
                    value={revealAt}
                    onChange={(e) => setRevealAt(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">O cartão só poderá ser visto após esta data.</p>
              </div> */}

              <div className="space-y-2">
                <Label>QR Code</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowQRCode(!showQRCode)} className="w-full">
                    <QrCode className="w-4 h-4 mr-2" />
                    {showQRCode ? "Ocultar QR Code" : "Gerar QR Code"}
                  </Button>
                </div>
                {showQRCode && (
                  <div className="p-4 bg-white rounded-lg flex justify-center">
                    {/* Placeholder for QR Code - In a real app use a library like qrcode.react */}
                    <div className="w-32 h-32 bg-black/10 flex items-center justify-center text-xs text-center">
                      QR Code gerado após salvar
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
