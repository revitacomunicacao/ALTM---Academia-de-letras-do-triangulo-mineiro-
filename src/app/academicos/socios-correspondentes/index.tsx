import { useContent } from "@/hooks/useContent"
import { ISocios } from "./types/ISocios"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaHandshake, FaTimes, FaArrowLeft } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"

// Componente de skeleton para tabela
const TableSkeleton = () => (
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
            <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
            <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-48" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-32" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-20" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-20" /></td>
              <td className="px-6 py-5 whitespace-nowrap"><Skeleton className="h-4 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)

export default function SociosCorrespondentes() {

  const { data: socios, loading, error, refetch } = useContent<ISocios>("/socios-correspondentes")
  

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Sócios Correspondentes"
        subtitle="Carregando informações dos sócios correspondentes"
        icon={<FaHandshake size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Sócios Correspondentes" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <TableSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Sócios Correspondentes"
        subtitle="Erro ao carregar os dados dos sócios correspondentes"
        icon={<FaHandshake size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Sócios Correspondentes" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações dos sócios correspondentes.</p>
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
      <PageHeader 
        title="Sócios Correspondentes"
        subtitle="Conheça os sócios correspondentes da Academia de Letras do Triângulo Mineiro"
        icon={<FaHandshake size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Sócios Correspondentes" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Lista de Sócios */}
        <div className="space-y-8">
          {socios && socios.map(({ id, socios, title }) => (
            <Card key={id} className="overflow-hidden">
              <div className="px-6 py-4 bg-altm-gold-50 border-b border-altm-gold-200">
                <h2 className="text-xl font-semibold text-altm-gold-800">{title}</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eleição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nascimento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Falecimento
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="bg-white divide-y divide-gray-200">
                    {socios && socios.length > 0 ? (
                      socios.map(({ nome, eleicao, falecimento, nascimento, posicao }, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {nome || '-'}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {posicao ? (
                              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {posicao}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {eleicao || '-'}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {nascimento || '-'}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {falecimento || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg">Nenhum sócio encontrado nesta categoria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}