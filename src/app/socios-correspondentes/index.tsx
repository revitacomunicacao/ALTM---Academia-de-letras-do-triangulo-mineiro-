import { useContent } from "@/hooks/useContent"
import { ISocios } from "./types/ISocios"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaHandshake, FaTimes, FaArrowLeft, FaBook } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import { IAcademicoConteudo } from "@/types/IAcademicoConteudo"
import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// Componente de skeleton para linha da tabela
const TableRowSkeleton = () => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <Skeleton className="h-4 w-48" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <Skeleton className="h-9 w-32 inline-block" />
    </td>
  </tr>
)

export default function SociosCorrespondentes() {
  const { data: socios, loading, error, refetch } =
    useContent<ISocios>("/socios-correspondentes")
  const {
    data: conteudo,
    loading: isLoading,
    error: isError,
    refetch: isRefetch,
  } = useContent<IAcademicoConteudo>("/socios-conteudo")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSocio, setSelectedSocio] = useState<ISocios | null>(null)

  const handleOpenBiografia = (socio: ISocios) => {
    setSelectedSocio(socio)
    setDialogOpen(true)
  }

  // ✅ Ordena alfabeticamente pelo "title" (nome) sem mutar o array original
  const sociosOrdenados = useMemo(() => {
    return (socios ?? [])
      .slice()
      .sort((a, b) =>
        (a.title ?? "").localeCompare((b.title ?? ""), "pt-BR", {
          sensitivity: "base",
        })
      )
  }, [socios])

  if (loading)
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Carregando"
          subtitle="Carregando informações dos sócios correspondentes"
          icon={<FaHandshake size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acadêmicos", href: "/academicos" },
            { label: "Sócios Correspondentes" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="overflow-hidden">
            <div className="px-6 py-4 bg-altm-gold-50 border-b border-altm-gold-200">
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-6 py-3 text-right">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(8)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Erro ao carregar"
          subtitle="Erro ao carregar os dados dos sócios correspondentes"
          icon={<FaHandshake size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acadêmicos", href: "/academicos" },
            { label: "Associados Correspondentes" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Erro ao carregar dados
            </h3>
            <p className="text-gray-600 mb-6">
              Não foi possível carregar as informações dos sócios correspondentes.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-altm-page">
      {conteudo.map(({ description, foto_topo, id, title }) => (
        <PageHeader
          title={title}
          key={id}
          subtitle={description}
          imagem_topo={foto_topo}
          icon={<FaHandshake size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acadêmicos", href: "/academicos" },
            { label: "Associados Correspondentes" },
          ]}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabela de Sócios Correspondentes */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-altm-gold-50 border-b border-altm-gold-200">
            <h2 className="text-xl font-semibold text-altm-gold-800">
              Associados Correspondentes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {sociosOrdenados.length > 0 ? (
                  sociosOrdenados.map((socio) => (
                    <tr
                      key={socio.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {socio.title}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleOpenBiografia(socio)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-altm-gold-600 text-primary text-sm font-medium hover:bg-altm-gold-700 transition-colors border-2 rounded-2xl cursor-pointer"
                        >
                          <FaBook className="w-4 h-4" />
                          <span>Ver Biografia</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg">
                          Nenhum sócio correspondente encontrado
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Dialog com Biografia + Foto + Resumo (header fixo + conteúdo com scroll) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-altm-gold-800">
              {selectedSocio?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Biografia do Sócio Correspondente
            </DialogDescription>
          </DialogHeader>

          {/* Scroll somente do conteúdo */}
          <div className="no-scrollbar -mx-6 max-h-[70vh] overflow-y-auto px-6">
            {/* Foto destacada */}
            {selectedSocio?.foto ? (
              <div className="mt-4 rounded-xl border bg-white overflow-hidden">
                <div className="w-full h-[260px] md:h-[360px] flex items-center justify-center bg-gray-50">
                  <img
                    src={selectedSocio.foto}
                    alt={selectedSocio.title}
                    className="max-w-full max-h-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            ) : null}

            {/* Biografia (conteúdo) */}
            <div
              className="prose prose-gray max-w-none mt-6 socios-lightbox-content whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: selectedSocio?.description || "" }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
            /* Base */
            .socios-lightbox-content img,
            .socios-lightbox-content video,
            .socios-lightbox-content iframe,
            .socios-lightbox-content audio {
              max-width: 100% !important;
              height: auto !important;
            }

            /* Remove floats/align do WP para não “grudar” à esquerda */
            .socios-lightbox-content img,
            .socios-lightbox-content figure,
            .socios-lightbox-content .wp-caption,
            .socios-lightbox-content .wp-block-image,
            .socios-lightbox-content .alignleft,
            .socios-lightbox-content .alignright,
            .socios-lightbox-content .aligncenter,
            .socios-lightbox-content .alignnone {
              float: none !important;
              clear: both !important;
            }

            /* Centraliza wrappers de imagem */
            .socios-lightbox-content figure.wp-block-image,
            .socios-lightbox-content .wp-block-image,
            .socios-lightbox-content figure,
            .socios-lightbox-content .wp-caption {
              margin-left: auto !important;
              margin-right: auto !important;
              text-align: center !important;
              width: auto !important;
              max-width: 100% !important;
            }

            /* Centraliza imagens (inclusive dentro de link) */
            .socios-lightbox-content figure img,
            .socios-lightbox-content .wp-block-image img,
            .socios-lightbox-content p > img,
            .socios-lightbox-content a > img,
            .socios-lightbox-content img.alignleft,
            .socios-lightbox-content img.alignright,
            .socios-lightbox-content img.aligncenter,
            .socios-lightbox-content img.alignnone {
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* Centraliza legendas */
            .socios-lightbox-content figcaption,
            .socios-lightbox-content .wp-element-caption,
            .socios-lightbox-content .wp-caption-text {
              text-align: center !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* Limpa floats residuais de HTML legado */
            .socios-lightbox-content p {
              overflow: hidden;
            }

            .socios-lightbox-content {
            white-space: pre-line;
            }
          `}</style>
    </div>
  )
}
