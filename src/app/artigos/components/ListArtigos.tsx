import { useContent } from "@/hooks/useContent"
import { IArtigos } from "../types/IArtigos"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FaBookOpen, FaUser, FaArrowRight, FaTimes } from "react-icons/fa"
import { Link } from "react-router-dom"
import banner from "@/assets/background.jpg"
import { useMemo, useState } from "react"

// Componente de skeleton para o card de artigo
const ArticleCardSkeleton = () => (
  <Card className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
)

export const ListArtigos = () => {
  const { data: artigos, loading, error, refetch } = useContent<IArtigos>("/artigos")
  const [autorId, setAutorId] = useState<number | "">("")

  const autores = useMemo(() => {
    const unique = new Map<number, { id: number; nome: string }>()
    for (const a of artigos) {
      if (a?.academico?.id && a?.academico?.nome && !unique.has(a.academico.id)) {
        unique.set(a.academico.id, { id: a.academico.id, nome: a.academico.nome })
      }
    }
    return Array.from(unique.values()).sort((a, b) => a.nome.localeCompare(b.nome))
  }, [artigos])

  const artigosFiltrados = useMemo(() => {
    if (autorId === "") return artigos
    return artigos.filter((a) => a?.academico?.id === autorId)
  }, [artigos, autorId])

  if (loading) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader 
          title="Artigos Acadêmicos"
          subtitle="Explore os artigos e textos dos acadêmicos da Academia de Letras do Triângulo Mineiro"
          imagem_topo={banner}
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Artigos" }
          ]}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader 
          title="Artigos Acadêmicos"
          subtitle="Erro ao carregar os artigos"
          imagem_topo={banner}
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Artigos" }
          ]}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar artigos</h3>
            <p className="text-gray-600 mb-6">Não foi possível carregar os artigos no momento.</p>
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
            >
              <FaBookOpen className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Artigos Acadêmicos"
        subtitle="Explore os artigos e textos dos acadêmicos da Academia de Letras do Triângulo Mineiro"
        imagem_topo={banner}
        icon={<FaBookOpen size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Artigos" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações da seção */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conheça os trabalhos acadêmicos, ensaios e reflexões produzidos pelos membros da nossa academia. 
            Uma coleção de conhecimento que reflete a diversidade intelectual do Triângulo Mineiro.
          </p>
        </div>

        {/* Filtro por autor */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por autor
              </label>
              <select
                id="autor"
                value={autorId}
                onChange={(e) => setAutorId(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-altm-gold-500 focus:border-altm-gold-500 transition-colors"
              >
                <option value="">Todos os autores</option>
                {autores.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </div>

            {autorId !== "" && (
              <button
                type="button"
                onClick={() => setAutorId("")}
                className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="w-4 h-4 mr-2" />
                Limpar
              </button>
            )}
          </div>
        </Card>

        {/* Grid de artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artigosFiltrados.map(({ 
            academico,
            date,
            id,
            resumo,
            title 
          }) => (
            <Card key={id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                {/* Header do card com foto e informações do acadêmico */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <img 
                      src={academico.foto} 
                      alt={`Foto do acadêmico ${academico.nome}`} 
                      className="w-16 h-16 object-cover rounded-full border-2 border-altm-gold-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-altm-gold-600 rounded-full flex items-center justify-center">
                      <FaUser className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      <Link
                        to={`/membros/${academico.id}`}
                        className="hover:text-altm-gold-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-altm-gold-500 rounded-sm transition-colors"
                      >
                        {academico.nome}
                      </Link>
                    </h3>
                  </div>
                </div>

                {/* Título do artigo */}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-altm-gold-600 transition-colors leading-tight">
                    {title}
                  </h4>
                </div>

                {/* Resumo */}
                <div className="mb-6">
                  <div 
                    className="text-gray-600 text-sm line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: resumo || "Confira este artigo completo..." }}
                  />
                </div>

                {/* Botão de leia mais */}
                <Link 
                  to={`/artigos/${id}`}
                  className="inline-flex items-center space-x-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-altm-gold-500 to-altm-gold-600 text-black font-medium rounded-lg hover:from-altm-gold-600 hover:to-altm-gold-700 transition-all duration-300 group-hover:shadow-lg"
                >
                  <span>Ler Artigo</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Mensagem quando não há artigos */}
        {artigosFiltrados && artigosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBookOpen className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum artigo encontrado</h3>
            <p className="text-gray-600">
              Ainda não há artigos publicados ou eles estão sendo preparados para exibição.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}