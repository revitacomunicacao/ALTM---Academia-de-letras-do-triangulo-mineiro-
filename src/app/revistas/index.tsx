import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FaBookOpen } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import type { IRevistas, IRevistaItem } from "./types/IRevistas"

function hasCodigo(item: IRevistaItem): boolean {
  return Boolean(item.codigo?.trim())
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
    setSelectedCodigo(item.codigo)
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
              <p className="text-gray-700">NÃ£o foi possÃ­vel carregar as revistas.</p>
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
          subtitle="Nenhum conteÃºdo encontrado"
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
                        {disabled ? "ConteÃºdo nÃ£o disponÃ­vel" : "Clique para ler"}
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
            setSelectedCodigo("")
            setSelectedTitle("")
          }
        }}
      >
        <DialogContent
          className="p-0 gap-0 overflow-hidden flex flex-col"
          style={{
            width: "min(96vw, 1100px)",
            maxWidth: "96vw",
            height: "min(92vh, 900px)",
            maxHeight: "92vh",
          }}
        >
          <div className="px-6 pt-6 pb-2 border-b border-gray-100 shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-900 pr-8">
              {selectedTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Visualização da edição
            </DialogDescription>
          </div>

          <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 bg-gray-50">
            <div
              className="revista-embed mx-auto bg-white rounded-lg shadow-sm"
              dangerouslySetInnerHTML={{ __html: selectedCodigo }}
            />
          </div>

          <style>{`
            .revista-embed iframe {
              display: block;
              margin-left: auto;
              margin-right: auto;
              max-width: 100%;
              min-height: 70vh;
              border: 0;
            }
            .revista-embed embed,
            .revista-embed object {
              display: block;
              margin-left: auto;
              margin-right: auto;
              max-width: 100%;
            }
          `}</style>
        </DialogContent>
      </Dialog>
    </div>
  )
}
