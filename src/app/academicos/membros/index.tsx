import { useContent } from "@/hooks/useContent"
import type { IMembros } from "./types/IMembros"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { FaGraduationCap, FaSearch, FaFilter, FaTimes, FaUser, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"

// Componente de skeleton para card de membro
const MemberCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
    <Skeleton className="aspect-square w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
)

// Componente de skeleton para filtros
const FiltersSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
    <div className="flex items-center space-x-2 mb-6">
      <FaFilter className="w-5 h-5 text-altm-gold-600" />
      <Skeleton className="h-6 w-48" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
)

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

  if(loading) return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Membros da Academia"
        subtitle="Explore os membros e acadêmicos da Academia de Letras do Triângulo Mineiro"
        icon={<FaGraduationCap size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiltersSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <MemberCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Membros da Academia"
        subtitle="Erro ao carregar os dados dos membros"
        icon={<FaGraduationCap />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar os dados dos membros.</p>
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
          >
            <FaSearch className="w-4 h-4" />
            <span>Tentar novamente</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Membros da Academia"
        subtitle="Explore os membros e acadêmicos da Academia de Letras do Triângulo Mineiro"
        icon={<FaGraduationCap size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <FaFilter className="w-5 h-5 text-altm-gold-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filtros de Busca</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Busca por Nome */}
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                <FaSearch className="inline w-4 h-4 mr-2" />
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digite o nome do membro..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-altm-gold-500 focus:border-altm-gold-500 transition-colors"
              />
            </div>

            {/* Filtro por Cadeira */}
            <div className="space-y-2">
              <label htmlFor="cadeira" className="block text-sm font-medium text-gray-700">
                <FaUser className="inline w-4 h-4 mr-2" />
                Cadeira
              </label>
              <select
                id="cadeira"
                value={cadeira}
                onChange={(e) => setCadeira(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-altm-gold-500 focus:border-altm-gold-500 transition-colors"
              >
                <option value="">Todas as cadeiras</option>
                {cadeiras.map((c) => (
                  <option key={c} value={c}>Cadeira {c}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Posição */}
            <div className="space-y-2">
              <label htmlFor="posicao" className="block text-sm font-medium text-gray-700">
                <FaMapMarkerAlt className="inline w-4 h-4 mr-2" />
                Posição
              </label>
              <select
                id="posicao"
                value={posicao}
                onChange={(e) => setPosicao(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-altm-gold-500 focus:border-altm-gold-500 transition-colors"
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
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setQ("");
                  setCadeira("");
                  setPosicao("");
                }}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                <span>Limpar Filtros</span>
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-altm-gold-600">{membrosFiltrados.length}</span> membro{membrosFiltrados.length !== 1 ? 's' : ''} encontrado{membrosFiltrados.length !== 1 ? 's' : ''}
            </p>
            {membrosFiltrados.length > 0 && (
              <div className="text-sm text-gray-500">
                Mostrando todos os resultados
              </div>
            )}
          </div>
        </div>

        {/* Grid de Membros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {membrosFiltrados.map((membro) => (
            <Link
              key={membro.id}
              to={`/academicos/membros/${membro.id}`}
              className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Foto */}
              <div className="aspect-square overflow-hidden relative">
                {membro.foto ? (
                  <img
                    src={membro.foto}
                    alt={membro.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FaGraduationCap className="text-gray-400 text-4xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Informações */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 text-lg mb-3 line-clamp-2 group-hover:text-altm-gold-600 transition-colors">
                  {membro.title}
                </h3>
                
                <div className="space-y-2">
                  {membro.cadeira && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-altm-gold-400 rounded-full"></div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cadeira:</span> {membro.cadeira}
                      </p>
                    </div>
                  )}
                  
                  {membro.posicao && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-altm-gold-400 rounded-full"></div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Posição:</span> {membro.posicao}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão de ação */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-altm-gold-600 text-sm font-medium group-hover:text-altm-gold-700">
                    <span>Ver perfil</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {membrosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum membro encontrado</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Tente ajustar os filtros de busca para encontrar o que procura.
            </p>
            <button
              onClick={() => {
                setQ("");
                setCadeira("");
                setPosicao("");
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}