import { IArtigosId } from "../types/IArtigos"
import { useParams } from "react-router-dom"
import { useContentId } from "@/hooks/useContentId"
import { Link } from "react-router-dom"

export default function ArtigosDetails() {
  const { id } = useParams()
  const { data: artigoData, loading, error, refetch } = useContentId<IArtigosId>("/artigo", String(id))
  
  // Como useContentId retorna um array, pegamos o primeiro item
  const artigo = Array.isArray(artigoData) ? artigoData[0] : artigoData

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Carregando artigo...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-600">Erro ao carregar o artigo</div>
      </div>
    )
  }

  if (!artigo) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Artigo não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Conteúdo Principal */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {artigo.title}
                </h1>

                {/* Data */}
                {artigo.date && (
                  <div className="mb-6">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {artigo.date}
                    </span>
                  </div>
                )}

                {/* Resumo */}
                {artigo.resumo && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#c1a44e]">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Resumo</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {artigo.resumo}
                    </p>
                  </div>
                )}

                {/* Conteúdo */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: artigo.conteudo }} />
                </div>
              </div>
            </article>

            {/* Navegação */}
            <div className="mt-8 flex justify-between items-center">
              <Link
                to="/artigos"
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-[#c1a44e] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar aos Artigos
              </Link>
            </div>
          </div>

          {/* Coluna Direita - Perfis dos Acadêmicos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Perfis dos acadêmicos citados
                </h3>

                {artigo.academico && artigo.academico.length > 0 ? (
                  <div className="space-y-4">
                    {artigo.academico.map((academico: { id: number; nome: string; foto: string }, index: number) => (
                      <Link
                        key={index}
                        to={`/academicos/membros/${academico.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-[#c1a44e] hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Foto do Acadêmico */}
                          {academico.foto && (
                            <div className="flex-shrink-0">
                              <img
                                src={academico.foto}
                                alt={academico.nome}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Nome */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#c1a44e] transition-colors">
                              {academico.nome}
                            </p>
                            <p className="text-xs text-gray-500">Acadêmico</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      Nenhum acadêmico citado neste artigo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}