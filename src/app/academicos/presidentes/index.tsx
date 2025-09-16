import { useContent } from "@/hooks/useContent"
import type { IPresidente } from "./types/IPresidente"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaCrown, FaTimes, FaArrowLeft } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"

// Componente de skeleton para lista
const ListSkeleton = () => (
  <Card>
    <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
      <Skeleton className="h-6 w-1/3" />
    </div>
    <div className="divide-y divide-gray-200">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  </Card>
)

export default function Presidentes() {
  const { data: presidentes, loading, error, refetch } = useContent<IPresidente>("/presidentes")

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Presidentes da ALTM"
        subtitle="Carregando informações dos presidentes"
        icon={<FaCrown size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Presidentes" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ListSkeleton />
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Presidentes da ALTM"
        subtitle="Erro ao carregar os dados dos presidentes"
        icon={<FaCrown size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Presidentes" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações dos presidentes.</p>
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
        title="Presidentes da ALTM"
        subtitle="Conheça a história dos presidentes da Academia de Letras do Triângulo Mineiro"
        icon={<FaCrown size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Presidentes" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Lista de Presidentes */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-altm-gold-50 border-b border-altm-gold-200">
            <h2 className="text-lg font-semibold text-altm-gold-800">Lista de Presidentes</h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {presidentes && presidentes.length > 0 ? (
              presidentes.map((presidente, idx) => (
                <li key={presidente.id || idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/academicos/membros/${presidente.presidente.id}`}
                        className="text-lg font-medium text-altm-gold-600 hover:text-altm-gold-700 hover:underline transition-colors"
                      >
                        {presidente.presidente.nome}
                      </Link>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {presidente.periodo}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center">
                <div className="text-gray-500">
                  <p className="text-lg">Nenhum presidente encontrado</p>
                </div>
              </li>
            )}
          </ul>
        </Card>

        {/* Contador */}
        {presidentes && presidentes.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {presidentes.length} presidente{presidentes.length !== 1 ? 's' : ''} encontrado{presidentes.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}