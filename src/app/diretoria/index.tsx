import { useContent } from "@/hooks/useContent"
import { IDiretoria } from "./types/IDiretoria"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaUsers, FaTimes, FaArrowLeft } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import { IAcademicoConteudo } from "@/types/IAcademicoConteudo"

// Componente de skeleton para tabela com 3 colunas (Diretoria Atual)
const TableSkeletonAtual = () => (
  <Card>
    <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
      <Skeleton className="h-6 w-1/3" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-48" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-32" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)

// Componente de skeleton para tabela com 2 colunas (Diretoria Fundadora)
const TableSkeletonFundadora = () => (
  <Card>
    <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
      <Skeleton className="h-6 w-1/3" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-48" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-32" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)

export default function Diretoria() {
  const { data: diretoria, loading, error, refetch } = useContent<IDiretoria>("/diretoria")
  const { data: conteudo, loading: isLoading, error: isError, refetch: isRefetch } = useContent<IAcademicoConteudo>("/diretoria-conteudo")

  if (loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title="Carregando"
        subtitle="Carregando informações da diretoria"
        icon={<FaUsers size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Diretoria" }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TableSkeletonAtual />
        <TableSkeletonFundadora />
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-altm-page">
      {conteudo.map(({ description, foto_topo, id, title, }) => (
        <PageHeader
          title={title}
          key={id}
          subtitle={description}
          imagem_topo={foto_topo}
          icon={<FaUsers size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acadêmicos", href: "/academicos" },
            { label: "Diretoria" }
          ]}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações da diretoria.</p>
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

  // Pegar o primeiro item do array (estrutura da API)
  const diretoriaData = diretoria[0];

  return (
    <div className="min-h-screen bg-altm-page">
      {conteudo.map(({ description, foto_topo, id, title, }) => (
        <PageHeader
          title={title}
          key={id}
          subtitle={description}
          imagem_topo={foto_topo}
          icon={<FaUsers size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acadêmicos", href: "/academicos" },
            { label: "Diretoria" }
          ]}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tabela da Diretoria Atual */}
        {diretoriaData?.diretoria && diretoriaData.diretoria.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-6 py-4 bg-altm-gold-50 border-b border-altm-gold-200">
              <h2 className="text-lg font-semibold text-altm-gold-800">Diretoria Atual</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadeira
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {diretoriaData.diretoria.map(({ cargo, membro }, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {cargo}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/academicos/membros/${membro.id}`}
                          className="text-sm font-medium text-altm-gold-600 hover:text-altm-gold-700 hover:underline transition-colors"
                        >
                          {membro.nome}
                        </Link>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {membro.cadeira || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tabela da Diretoria Fundadora */}
        {diretoriaData?.diretoria_fundadores && diretoriaData.diretoria_fundadores.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-6 py-4 bg-altm-gold-50 border-b border-altm-gold-200">
              <h2 className="text-lg font-semibold text-altm-gold-800">Diretoria Fundadora</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {diretoriaData.diretoria_fundadores.map(({ cargo, membro }, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {cargo}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/academicos/membros/${membro.id}`}
                          className="text-sm font-medium text-altm-gold-600 hover:text-altm-gold-700 hover:underline transition-colors"
                        >
                          {membro.nome}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 