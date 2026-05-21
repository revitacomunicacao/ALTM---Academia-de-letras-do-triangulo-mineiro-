import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { X } from "lucide-react"
import { FaBookOpen } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import type { IRevistas, IRevistaItem } from "./types/IRevistas"

function hasCodigo(item: IRevistaItem): boolean {
  return Boolean(item.codigo?.trim())
}

/** Remove dimensões fixas do embed (ex.: 700×400) para preencher o lightbox. */
function normalizeRevistaEmbed(html: string): string {
  return html.replace(/<iframe\b([^>]*)>/gi, (_, attrs: string) => {
    const clean = attrs
      .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, "")
      .replace(/\swidth\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, "")
      .replace(/\sheight\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, "")
    return `<iframe${clean} style="width:100%;height:100%;border:0;display:block">`
  })
}

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

export default function Revistas() {
  const { data, loading, error, refetch } = useContent<IRevistas>("/revistas")
  const revistaPage = Array.isArray(data) ? data[0] : data

  const [open, setOpen] = useState(false)
  const [selectedCodigo, setSelectedCodigo] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")

  const handleOpen = (item: IRevistaItem) => {
    if (!hasCodigo(item)) return
    setSelectedCodigo(normalizeRevistaEmbed(item.codigo))
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
    <>
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
                const disabled = !hasCodigo(item)

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
                        {disabled ? "Conteúdo não disponível" : "Clique para ler"}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) {
            setSelectedCodigo("")
            setSelectedTitle("")
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="revista-lightbox !fixed !inset-0 !top-0 !left-0 !m-auto z-[60] flex h-[96vh] w-[96vw] max-w-[96vw] !translate-x-0 !translate-y-0 flex-col p-0 gap-0 overflow-hidden border-0 shadow-2xl data-[state=open]:animate-none data-[state=closed]:animate-none sm:max-w-[96vw]"
        >
          <VisuallyHidden>
            <DialogTitle>{selectedTitle}</DialogTitle>
          </VisuallyHidden>

          <DialogClose
            className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg ring-1 ring-black/10 transition hover:bg-white hover:text-altm-gold-600 focus:outline-none focus:ring-2 focus:ring-altm-gold-500"
            aria-label="Fechar revista"
          >
            <X className="h-5 w-5" />
          </DialogClose>

          <div
            className="revista-embed min-h-0 flex-1 w-full overflow-hidden [&_iframe]:!block [&_iframe]:!h-full [&_iframe]:!min-h-full [&_iframe]:!w-full [&_iframe]:!max-w-full [&_iframe]:!border-0 [&_embed]:!block [&_embed]:!h-full [&_embed]:!w-full [&_object]:!block [&_object]:!h-full [&_object]:!w-full"
            dangerouslySetInnerHTML={{ __html: selectedCodigo }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
