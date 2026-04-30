import { useContent } from "@/hooks/useContent"
import { IProgramacaoCultural } from "../programacao-cultural/types/IProgramacaoCultural"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaBook, FaTimes, FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"
import { useMemo } from "react"

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
  const { data: lancamentos, loading, error, refetch } = useContent<IProgramacaoCultural>("lancamento_de_livros")
  const lancamentosOrdenados = useMemo(() => {
    return [...lancamentos].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  }, [lancamentos])

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
      <PageHeader
        title="Lançamento de Livros"
        subtitle="Confira os lançamentos publicados pela Academia de Letras do Triângulo Mineiro."
        icon={<FaBook size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Programação Cultural", href: "/programacao-cultural" },
          { label: "Lançamento de Livros" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lançamentos</h2>
            <p className="text-gray-600">
              Clique em um lançamento para ver as informações completas.
            </p>
          </div>
        </Card>

        {lancamentosOrdenados.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum lançamento encontrado</h3>
            <p className="text-gray-600">
              Ainda não há lançamentos publicados ou eles estão sendo preparados para exibição.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lancamentosOrdenados.map(({ id, title, subtitulo, imagem_topo, date }) => (
              <Link
                key={id}
                to={`/lancamento-de-livros/${id}`}
                className="block group"
              >
                <Card className="h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {imagem_topo && (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={imagem_topo}
                        alt={title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-altm-gold-600 transition-colors line-clamp-2">
                      {title}
                    </h3>

                    {subtitulo && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {subtitulo}
                      </p>
                    )}

                    {date && (
                      <div className="flex items-center text-sm text-gray-500 mb-5">
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        <span>{new Date(date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    )}

                    <div className="inline-flex items-center space-x-2 text-altm-gold-600 font-semibold">
                      <span>Ver detalhes</span>
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
