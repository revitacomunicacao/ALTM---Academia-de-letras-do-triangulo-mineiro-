import { useContent } from "@/hooks/useContent"
import { IProgramacaoCultural } from "../programacao-cultural/types/IProgramacaoCultural"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaBook, FaTimes, FaArrowLeft } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"

// Componente de skeleton para a página
const ContentSkeleton = () => (
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
)

export default function LancamentoDeLivros() {
  const { data: lancamentos, loading, error, refetch } = useContent<IProgramacaoCultural>("andamento-de-livros")

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Lançamento de Livros"
        subtitle="Carregando informações sobre lançamentos"
        icon={<FaBook size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Programação Cultural", href: "/programacao-cultural" },
          { label: "Lançamento de Livros" }
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
        title="Lançamento de Livros"
        subtitle="Erro ao carregar as informações"
        icon={<FaBook size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Programação Cultural", href: "/programacao-cultural" },
          { label: "Lançamento de Livros" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações sobre lançamentos de livros.</p>
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
      {lancamentos && lancamentos.map(({
        content,
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
              { label: "Programação Cultural", href: "/programacao-cultural" },
              { label: "Lançamento de Livros" }
            ]}
          />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6 justify-center">
                  <h2 className="text-2xl text-center font-bold text-gray-800">Lançamento de Livros</h2>
                </div>
                
                <div className="prose max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: content }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      ))}
    </div>
  )
}
