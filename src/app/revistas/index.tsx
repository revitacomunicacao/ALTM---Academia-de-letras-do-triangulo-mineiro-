// src/app/revistas/index.tsx
import React, { useEffect, useMemo, useRef, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FaBookOpen } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import type { IRevistas, IRevistaItem } from "./types/IRevistas"

import HTMLFlipBook from "react-pageflip"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

// Wrapper para evitar conflitos de tipagem do react-pageflip
const FlipBook = HTMLFlipBook as unknown as React.ComponentType<any>

const PageSkeleton = () => (
  <div className="min-h-screen bg-altm-page">
    <PageHeader
      title="Revista Convergência"
      subtitle="Carregando revistas..."
      icon={<FaBookOpen size={50} />}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Revista Convergência", href: "/revistas" },
      ]}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[3/4] rounded-lg" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function useContainerWidth(dep?: any) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const update = () => setWidth(el.clientWidth || 0)

    // mede depois do Dialog abrir (layout pronto)
    const raf = requestAnimationFrame(update)

    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [dep])

  return { ref, width }
}

function FlipbookViewer({
  pages,
  title,
  open,
}: {
  pages: string[]
  title: string
  open: boolean
}) {
  const { ref, width } = useContainerWidth(open)

  // ✅ FORÇA SEMPRE “livro aberto” (2 páginas)
  const forceSpread = true

  const usable = useMemo(() => Math.max(320, width - 24), [width])

  // largura de UMA página
  const pageW = useMemo(() => {
    // como é spread, calcula metade do espaço útil
    const w = Math.floor(usable / 2)
    return clamp(w, 240, 560)
  }, [usable])

  const pageH = useMemo(() => Math.floor(pageW * 1.35), [pageW])

  // largura total do livro (2 páginas)
  const bookW = useMemo(() => pageW * 2, [pageW])

  const normalizedPages = useMemo(() => {
    const list = (pages || []).filter(Boolean)
    if (!list.length) return []
    // se ímpar, completa com branco para fechar par
    if (list.length % 2 === 0) return list
    return [...list, "__BLANK__"]
  }, [pages])

  if (!normalizedPages.length) {
    return <div className="text-center py-10 text-gray-600">Nenhuma página disponível.</div>
  }

  return (
    <div ref={ref} className="w-full h-full">
      {/* ✅ scroll horizontal se necessário, mas mantém “livro aberto” */}
      <div className="w-full h-full overflow-auto">
        <div className="mx-auto" style={{ width: bookW }}>
          <FlipBook
            // tamanho de UMA página
            width={pageW}
            height={pageH}
            size="fixed"

            // ✅ dupla sempre
            showCover={true}
            usePortrait={false}   // <<< força 2 páginas
            autoSize={false}

            // ajustes
            minWidth={240}
            maxWidth={1400}
            minHeight={360}
            maxHeight={2000}
            maxShadowOpacity={0.25}
            mobileScrollSupport={true}
            className="shadow-lg"
            startPage={0}
            drawShadow={true}
            flippingTime={650}
            clickEventForward={true}
            disableFlipByClick={false}
            showPageCorners={true}
          >
            {normalizedPages.map((src, idx) => {
              if (src === "__BLANK__") {
                return <div key={`blank-${idx}`} className="bg-white w-full h-full" />
              }

              return (
                <div key={`${src}-${idx}`} className="bg-white w-full h-full">
                  <img
                    src={src}
                    alt={`${title} — página ${idx + 1}`}
                    className="w-full h-full object-contain bg-white select-none"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
              )
            })}
          </FlipBook>
        </div>
      </div>
    </div>
  )
}

export default function Revistas() {
  const { data, loading, error, refetch } = useContent<IRevistas>("/revistas")
  const revistaPage = Array.isArray(data) ? data[0] : data

  const [open, setOpen] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState("")

  const getPagesFromItem = (item: IRevistaItem): string[] => {
    // ACF Galeria pode estar em item.pdf (nome legado) ou paginas/pages
    const raw: any = (item as any).pdf ?? (item as any).paginas ?? (item as any).pages
    if (!Array.isArray(raw)) return []

    return raw
      .map((p: any) => {
        if (!p) return null
        if (typeof p === "string") return p
        if (typeof p?.url === "string") return p.url
        if (typeof p?.sizes?.large === "string") return p.sizes.large
        if (typeof p?.sizes?.full === "string") return p.sizes.full
        return null
      })
      .filter(Boolean) as string[]
  }

  const handleOpen = (item: IRevistaItem) => {
    const pages = getPagesFromItem(item)
    if (!pages.length) return
    setSelectedPages(pages)
    setSelectedTitle(item.titulo_da_revista || "Revista")
    setOpen(true)
  }

  if (loading) return <PageSkeleton />

  if (error) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Revista Convergência"
          subtitle="Erro ao carregar as revistas"
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Revista Convergência", href: "/revistas" },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <div className="text-center space-y-4">
              <p className="text-gray-700">Não foi possível carregar as revistas.</p>
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!revistaPage) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Revista Convergência"
          subtitle="Nenhum conteúdo encontrado"
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Revista Convergência", href: "/revistas" },
          ]}
        />
      </div>
    )
  }

  const items: IRevistaItem[] = Array.isArray((revistaPage as any).revistas)
    ? ((revistaPage as any).revistas as IRevistaItem[])
    : []

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={(revistaPage as any).title || "Revista Convergência"}
        subtitle="Edições disponíveis"
        icon={<FaBookOpen size={50} />}
        imagem_topo={(revistaPage as any).imagem_topo}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Revista Convergência", href: "/revistas" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-600">Nenhuma revista cadastrada.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item, idx) => {
                const pages = getPagesFromItem(item)
                const disabled = pages.length === 0

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpen(item)}
                    disabled={disabled}
                    className={`text-left group ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    aria-label={item.titulo_da_revista || "Abrir revista"}
                  >
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-white">
                      {item.capa ? (
                        <img
                          src={item.capa}
                          alt={item.titulo_da_revista}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          Sem capa
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-altm-gold-600 transition-colors line-clamp-2">
                        {item.titulo_da_revista}
                      </p>
                      <p className="text-xs text-gray-500">
                        {disabled ? "Páginas não disponíveis" : "Abrir para folhear"}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) {
            setSelectedPages([])
            setSelectedTitle("")
          }
        }}
      >
        {/* ✅ modal realmente grande (inline style vence qualquer max-w do componente) */}
        <DialogContent
          className="p-3 overflow-hidden"
          style={{
            width: "98vw",
            maxWidth: "98vw",
            height: "92vh",
            maxHeight: "92vh",
          }}
        >
          <VisuallyHidden>
            <DialogTitle>Visualização da Revista</DialogTitle>
            <DialogDescription>Leitor em formato de livro (duas páginas abertas).</DialogDescription>
          </VisuallyHidden>

          <div className="h-full w-full overflow-hidden">
            <FlipbookViewer pages={selectedPages} title={selectedTitle} open={open} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
