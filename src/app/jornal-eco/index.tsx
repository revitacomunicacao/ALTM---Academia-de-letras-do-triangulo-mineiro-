import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { X } from "lucide-react"
import { FaNewspaper } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import type { IJornalEco, IJornalEcoItem } from "./types/IJornalEco"

function hasPdf(item: IJornalEcoItem): boolean {
  return Boolean(item.pdf?.trim())
}

const PageSkeleton = () => (
  <div className="min-h-screen bg-altm-page">
    <PageHeader
      title="Jornal ECO"
      subtitle="Carregando edições..."
      icon={<FaNewspaper size={46} />}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Jornal ECO", href: "/jornal-eco" },
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

export default function JornalEco() {
  const { data, loading, error, refetch } = useContent<IJornalEco>("/jornal-eco")
  const jornalPage = Array.isArray(data) ? data[0] : data

  const [open, setOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")

  const handleOpen = (item: IJornalEcoItem) => {
    if (!hasPdf(item)) return
    setSelectedPdf(item.pdf.trim())
    setSelectedTitle(item.titulo_do_jornal || "Jornal ECO")
    setOpen(true)
  }

  if (loading) return <PageSkeleton />

  if (error) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Jornal ECO"
          subtitle="Erro ao carregar as edições"
          icon={<FaNewspaper size={46} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Jornal ECO", href: "/jornal-eco" },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <div className="text-center space-y-4">
              <p className="text-gray-700">Não foi possível carregar o Jornal ECO.</p>
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

  if (!jornalPage) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Jornal ECO"
          subtitle="Nenhum conteúdo encontrado"
          icon={<FaNewspaper size={46} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Jornal ECO", href: "/jornal-eco" },
          ]}
        />
      </div>
    )
  }

  const items: IJornalEcoItem[] = Array.isArray(jornalPage.revistas) ? jornalPage.revistas : []

  return (
    <>
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title={jornalPage.title || "Jornal ECO"}
          subtitle="Edições disponíveis"
          icon={<FaNewspaper size={46} />}
          imagem_topo={jornalPage.imagem_topo}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Jornal ECO", href: "/jornal-eco" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-10 text-gray-600">Nenhuma edição cadastrada.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map((item, idx) => {
                  const disabled = !hasPdf(item)

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpen(item)}
                      disabled={disabled}
                      className={`text-left group ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                      aria-label={item.titulo_do_jornal || "Abrir edição"}
                    >
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-white">
                        {item.capa ? (
                          <img
                            src={item.capa}
                            alt={item.titulo_do_jornal}
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
                          {item.titulo_do_jornal}
                        </p>
                        <p className="text-xs text-gray-500">
                          {disabled ? "PDF não disponível" : "Clique para ler"}
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
            setSelectedPdf("")
            setSelectedTitle("")
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="!fixed !inset-0 !top-0 !left-0 !m-auto z-[60] flex h-[96vh] w-[96vw] max-w-[96vw] !translate-x-0 !translate-y-0 flex-col p-0 gap-0 overflow-hidden border-0 bg-neutral-100 shadow-2xl data-[state=open]:animate-none data-[state=closed]:animate-none sm:max-w-[96vw]"
        >
          <VisuallyHidden>
            <DialogTitle>{selectedTitle}</DialogTitle>
          </VisuallyHidden>

          <DialogClose
            className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg ring-1 ring-black/10 transition hover:bg-white hover:text-altm-gold-600 focus:outline-none focus:ring-2 focus:ring-altm-gold-500"
            aria-label="Fechar edição"
          >
            <X className="h-5 w-5" />
          </DialogClose>

          {selectedPdf ? (
            <iframe
              key={selectedPdf}
              src={selectedPdf}
              title={selectedTitle}
              className="min-h-0 flex-1 w-full border-0 bg-white"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
