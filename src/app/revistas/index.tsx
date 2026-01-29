// index.tsx
import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { FaBookOpen } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import type { IRevistas, IRevistaItem } from "./types/IRevistas"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

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

function PdfLightbox({
  pdfUrl,
  title,
}: {
  pdfUrl: string
  title?: string
}) {
  // Mostra o PDF nativo do browser
  // (não faz fetch via JS, então evita CORS e worker)
  return (
    <div className="h-full w-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {title || "Visualização do PDF"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            Se não carregar aqui, use “Abrir em nova aba”.
          </p>
        </div>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 px-3 py-2 rounded-md bg-altm-gold-600 text-white text-sm font-medium hover:bg-altm-gold-700 transition-colors"
        >
          Abrir em nova aba
        </a>
      </div>

      <div className="flex-1 min-h-0 rounded-lg overflow-hidden border bg-white">
        <iframe
          title={title || "PDF"}
          src={pdfUrl}
          className="w-full h-full"
        />
        {/* fallback para browsers que não renderizam no iframe */}
        <noscript />
      </div>

      {/* fallback extra: object, caso seu browser/servidor não goste do iframe */}
      <div className="hidden">
        <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
          <p className="text-sm text-gray-700">
            Seu navegador não conseguiu exibir o PDF embutido.{" "}
            <a
              className="text-altm-gold-600 underline"
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
            >
              Clique para abrir
            </a>
            .
          </p>
        </object>
      </div>
    </div>
  )
}

export default function Revistas() {
  const { data, loading, error, refetch } = useContent<IRevistas>("/revistas")
  const revistaPage = Array.isArray(data) ? data[0] : data

  const [open, setOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)

  const handleOpenPdf = (pdf?: string | null, titulo?: string | null) => {
    if (!pdf) return
    setSelectedPdf(pdf)
    setSelectedTitle(titulo || "Revista")
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

  const items: IRevistaItem[] = Array.isArray(revistaPage.revistas)
    ? revistaPage.revistas
    : []

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={revistaPage.title || "Revista Convergência"}
        subtitle="Edições disponíveis"
        icon={<FaBookOpen size={50} />}
        imagem_topo={revistaPage.imagem_topo}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Revista Convergência", href: "/revistas" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              Nenhuma revista cadastrada.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item, idx) => {
                const disabled = !item.pdf
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenPdf(item.pdf, item.titulo_da_revista)}
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
                        {disabled ? "PDF não disponível" : "Abrir"}
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
            setSelectedPdf(null)
            setSelectedTitle(null)
          }
        }}
      >
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] overflow-hidden p-4">
          <VisuallyHidden>
            <DialogTitle>Visualização da Revista</DialogTitle>
            <DialogDescription>PDF aberto no leitor nativo do navegador.</DialogDescription>
          </VisuallyHidden>

          {selectedPdf ? (
            <PdfLightbox pdfUrl={selectedPdf} title={selectedTitle || undefined} />
          ) : (
            <div className="text-center py-10 text-gray-600">Nenhum PDF selecionado.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
