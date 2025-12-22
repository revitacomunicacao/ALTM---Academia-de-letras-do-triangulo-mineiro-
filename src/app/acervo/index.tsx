import { useContent } from "@/hooks/useContent"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FaBookOpen, FaTimes, FaArrowLeft } from "react-icons/fa"
import { IAcervo } from "./types/IAcervo"

// Skeleton da tabela (3 colunas)
const TableSkeleton = () => (
  <Card>
    <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
      <Skeleton className="h-6 w-1/3" />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4 text-left">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="px-6 py-4 text-left">
              <Skeleton className="h-4 w-32" />
            </th>
            <th className="px-6 py-4 text-left">
              <Skeleton className="h-4 w-24" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {[...Array(6)].map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-5">
                <Skeleton className="h-16 w-12 rounded-md" />
              </td>
              <td className="px-6 py-5">
                <Skeleton className="h-4 w-64" />
              </td>
              <td className="px-6 py-5">
                <Skeleton className="h-4 w-40" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)

export default function AcervoBibliografico() {
  const { data: acervo, loading, error, refetch } = useContent<IAcervo>("/acervo")

  if (loading)
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Acervo Bibliográfico"
          subtitle="Carregando informações do acervo"
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acervo Bibliográfico", href: "/acervo" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TableSkeleton />
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Acervo Bibliográfico"
          subtitle="Erro ao carregar as informações"
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acervo Bibliográfico", href: "/acervo" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-6">Não foi possível carregar o acervo no momento.</p>
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
      {acervo?.map(({ id, title, imagem_topo, titulos }) => (
        <div key={id}>
          <PageHeader
            title={title || "Acervo Bibliográfico"}
            icon={<FaBookOpen size={50} />}
            imagem_topo={imagem_topo || undefined}
            breadcrumb={[
              { label: "Home", href: "/" },
              { label: "Acervo Bibliográfico", href: "/acervo" },
            ]}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Títulos</h2>
              </div>

              {titulos && titulos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Capa</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Título</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Autor</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {titulos.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-5">
                            {item.capa ? (
                              <img
                                src={item.capa}
                                alt={item.titulo ? `Capa: ${item.titulo}` : "Capa"}
                                className="h-16 w-12 object-cover rounded-md border border-gray-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-16 w-12 rounded-md border border-gray-200 bg-gray-50" />
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="text-sm font-medium text-gray-900">{item.titulo || "-"}</div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-700">{item.autor || "-"}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-10 text-center text-gray-600">
                  Nenhum título cadastrado no acervo.
                </div>
              )}
            </Card>
          </div>
        </div>
      ))}
    </div>
  )
}
