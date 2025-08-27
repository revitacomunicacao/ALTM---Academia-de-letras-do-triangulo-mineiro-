import { useContent } from "@/hooks/useContent"
import type { IMembros } from "./types/IMembros"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

export default function Membros() {
  const { data: membros, loading, error, refetch } = useContent<IMembros>("/membros")

  console.log(membros)

  // filtros
  const [q, setQ] = useState("");
  const [cadeira, setCadeira] = useState<string>("")
  const [posicao, setPosicao] = useState<string>("")

  const normalize = (s: string) => 
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const cadeiras = useMemo(() => {
    if (!membros) return [];
    
    return Array.from(
      new Set(membros.map((m: IMembros) => m.cadeira).filter(Boolean))
    ).sort((a, b) => Number(a) - Number(b));
  }, [membros]);

  const posicoes = useMemo(() => {
    if (!membros) return [];
    
    return Array.from(
      new Set(membros.map((m: IMembros) => m.posicao).filter(Boolean))
    ).sort();
  }, [membros]);

  const membrosFiltrados = useMemo(() => {
    if (!membros) return [];

    return membros.filter((membro) => {
      const matchNome = !q || normalize(membro.title).includes(normalize(q));
      const matchCadeira = !cadeira || membro.cadeira === cadeira;
      const matchPosicao = !posicao || membro.posicao === posicao;

      return matchNome && matchCadeira && matchPosicao;
    });
  }, [membros, q, cadeira, posicao]);

  if(loading) return <div className="flex justify-center items-center min-h-screen">Carregando...</div>

  if(error) return <div className="flex justify-center items-center min-h-screen text-red-500">Erro ao carregar dados</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Membros da Academia</h1>
          <p className="text-gray-600">Explore os membros e acadêmicos da ALTM</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros de Busca</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca por Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digite o nome..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Cadeira */}
            <div>
              <label htmlFor="cadeira" className="block text-sm font-medium text-gray-700 mb-2">
                Cadeira
              </label>
              <select
                id="cadeira"
                value={cadeira}
                onChange={(e) => setCadeira(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as cadeiras</option>
                {cadeiras.map((c) => (
                  <option key={c} value={c}>Cadeira {c}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Posição */}
            <div>
              <label htmlFor="posicao" className="block text-sm font-medium text-gray-700 mb-2">
                Posição
              </label>
              <select
                id="posicao"
                value={posicao}
                onChange={(e) => setPosicao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as posições</option>
                {posicoes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          {(q || cadeira || posicao) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setQ("");
                  setCadeira("");
                  setPosicao("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {membrosFiltrados.length} membro{membrosFiltrados.length !== 1 ? 's' : ''} encontrado{membrosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Membros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {membrosFiltrados.map((membro) => (
            <Link
              key={membro.id}
              to={`/academicos/membros/${membro.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Foto */}
              <div className="aspect-square overflow-hidden">
                {membro.foto ? (
                  <img
                    src={membro.foto}
                    alt={membro.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">👤</span>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                  {membro.title}
                </h3>
                
                <div className="space-y-1">
                  {membro.cadeira && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cadeira:</span> {membro.cadeira}
                    </p>
                  )}
                  
                  {membro.posicao && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Posição:</span> {membro.posicao}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {membrosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca para encontrar o que procura.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}