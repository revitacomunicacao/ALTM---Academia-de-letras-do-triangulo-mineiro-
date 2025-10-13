import { useContent } from "@/hooks/useContent"
import { IHistoricoSite } from "./types/IHistoricoSite"
import { PageHeader } from "@/components/PageHeader"
import { FaArrowLeft, FaBook, FaBuilding, FaInfoCircle, FaTimes } from "react-icons/fa"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
const ContentSkeleton = () => (
  <div className="space-y-8">
    <Card>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
      </div>
    </Card>
    
    <Card>
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/3" />
        <div className="relative">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  </div>
)
export default function HistoricoDoSite() {
  const { data: conteudo, loading, error, refetch } = useContent<IHistoricoSite>("historico-do-site")
  
  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Carregando"
        subtitle="Carregando informações sobre o histórico do site"
        icon={<FaBuilding size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sobre a ALTM", href: "/sobre-a-altm" },
          { label: "Histórico do site" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentSkeleton />
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Fundação"
        subtitle="Erro ao carregar as informações"
        icon={<FaBuilding size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Histórico do site", href: "/historico-do-site" },
          { label: "Fundação" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações sobre a fundação da ALTM.</p>
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
      {conteudo && conteudo.map(({
        description,
        id,
        imagem_topo,
        subtitulo,
        title
      }) => (
        <div key={id}>
          <PageHeader
            title={title}
            subtitle={subtitulo}
            icon={<FaBook size={50} />}
            imagem_topo={imagem_topo}
            breadcrumb={[
              { label: "Home", href: "/" },
              { label: "Sobre a ALTM", href: "/historico-do-site" },
              { label: "Histórico do site" }
            ]}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Descrição */}
              <Card>
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: description }}
                      className="text-gray-700 leading-relaxed break-words"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ))}
    </div>

  )
}