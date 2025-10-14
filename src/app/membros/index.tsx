import { useContent } from "@/hooks/useContent"
import type { IMembros } from "./types/IMembros"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaGraduationCap, FaSearch, FaFilter, FaTimes, FaUser, FaCalendarAlt } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import banner from "@/assets/background.jpg"
import { IAcademicoConteudo } from "@/types/IAcademicoConteudo"

// Componente de skeleton para linha de membro
const MemberRowSkeleton = () => (
  <div className="flex items-center p-4">
    {/* Foto circular */}
    <div className="flex-shrink-0 mr-4">
      <Skeleton className="w-16 h-16 rounded-full" />
    </div>
    
    {/* Nome e informações */}
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
    
    {/* Badge de posição */}
    <div className="flex-shrink-0">
      <Skeleton className="h-7 w-24 rounded-full" />
    </div>
  </div>
)

// Componente de skeleton para grupo de cadeira
const CadeiraGroupSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    {/* Cabeçalho da cadeira */}
    <div className="bg-gradient-to-r from-altm-gold-600 to-altm-gold-700 px-6 py-4">
      <Skeleton className="h-6 w-32" />
    </div>
    
    {/* Lista de membros */}
    <div className="divide-y divide-gray-100">
      {[...Array(3)].map((_, i) => (
        <MemberRowSkeleton key={i} />
      ))}
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

export default function Academicos() {
  const { data: membros, loading, error, refetch } = useContent<IMembros>("/membros")
  const { data: conteudo, loading: isLoading, error: isError } = useContent<IAcademicoConteudo>('membros-conteudo')

  // filtros
  const [q, setQ] = useState("");
  const [cadeira, setCadeira] = useState<string>("")

  const normalize = (s: string) => 
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const cadeiras = useMemo(() => {
    if (!membros) return [];
    
    const cadeirasUnicas = Array.from(
      new Set(membros.map((m: IMembros) => m.cadeira).filter(Boolean))
    );
    
    // Ordenação especial: patrono, fundador, depois números em ordem crescente, atual por último
    return cadeirasUnicas.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Patrono sempre primeiro
      if (aLower === 'patrono') return -1;
      if (bLower === 'patrono') return 1;
      
      // Fundador sempre segundo
      if (aLower === 'fundador') return -1;
      if (bLower === 'fundador') return 1;
      
      // Atual sempre último
      if (aLower === 'atual') return 1;
      if (bLower === 'atual') return -1;
      
      // Números em ordem crescente
      const aNum = Number(a);
      const bNum = Number(b);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      // Fallback para ordem alfabética
      return a.localeCompare(b);
    });
  }, [membros]);

  const membrosFiltrados = useMemo(() => {
    if (!membros) return [];

    return membros.filter((membro) => {
      const matchNome = !q || normalize(membro.title).includes(normalize(q));
      const matchCadeira = !cadeira || membro.cadeira === cadeira;

      return matchNome && matchCadeira;
    });
  }, [membros, q, cadeira]);

  // Agrupar membros por cadeira

  const membrosAgrupados = useMemo(() => {
    if (!membrosFiltrados) return [];

    const grupos = membrosFiltrados.reduce((acc, membro) => {
      const cadeiraKey = membro.cadeira || 'Sem Cadeira';
      if (!acc[cadeiraKey]) {
        acc[cadeiraKey] = [];
      }
      acc[cadeiraKey].push(membro);
      return acc;
    }, {} as Record<string, IMembros[]>);

    // Ordenar cada grupo por nome
    Object.keys(grupos).forEach(cadeira => {
      grupos[cadeira].sort((a, b) => a.title.localeCompare(b.title));
    });

    // Retornar cadeiras na ordem correta
    return cadeiras.map(cadeira => ({
      cadeira,
      membros: grupos[cadeira] || []
    })).filter(grupo => grupo.membros.length > 0);
  }, [membrosFiltrados, cadeiras]);

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      {conteudo.map((
        {
          description,
          id,
          title 
        }) => (
          <span key={id}>
            <PageHeader 
              title={title}
              subtitle={description}
              imagem_topo={banner}
              icon={<FaGraduationCap size={50} />}
              breadcrumb={[
                { label: "Home", href: "/" },
                { label: "Membros", href: "/academicos" },
                { label: "Membros" }
              ]}
            />
          </span>
      ))}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiltersSkeleton />
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <CadeiraGroupSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Membros da ALTM"
        subtitle="Erro ao carregar os dados dos Membros"
        imagem_topo={banner}
        icon={<FaGraduationCap />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Membros", href: "/academicos" },
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
    <>
      {conteudo.map((
        {
          description,
          id,
          title 
        }) => (
          <span key={id}>
            <PageHeader 
              title={title}
              subtitle={description}
              imagem_topo={banner}
              icon={<FaGraduationCap size={50} />}
              breadcrumb={[
                { label: "Home", href: "/" },
                { label: "Membros", href: "/academicos" },
                { label: "Membros" }
              ]}
            />
          </span>
      ))}
      <div className="min-h-screen bg-altm-page">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Filtros */}
          <Card className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <FaFilter className="w-5 h-5 text-altm-gold-600" />
              <h2 className="text-xl font-semibold text-gray-800">Filtros de Busca</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            </div>

            {/* Botão Limpar Filtros */}
            {(q || cadeira) && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setQ("");
                    setCadeira("");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Limpar Filtros</span>
                </button>
              </div>
            )}
          </Card>

          {/* Resultados
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
          </div> */}

          {/* Lista de Membros por Cadeira */}
          <div className="space-y-8">
            {membrosAgrupados.map((grupo) => {
              // Identificar a maior posição numérica nesta cadeira
              const posicoesNumericas = grupo.membros
                .map(m => Number(m.posicao))
                .filter(p => !isNaN(p));
              
              const maiorPosicao = posicoesNumericas.length > 0 
                ? Math.max(...posicoesNumericas) 
                : null;
              
              return (
                <div key={grupo.cadeira} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Título da Cadeira */}
                  <div className="bg-gradient-to-r from-altm-gold-600 to-altm-gold-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-primary flex items-center">
                      <FaGraduationCap className="mr-3" />
                      Cadeira {grupo.cadeira}
                    </h2>
                  </div>

                {/* Tabela de Membros */}
                <div className="divide-y divide-gray-100">
                  {grupo.membros.map((membro) => {
                    const isMembro = membro.e_membro_da_academia === 'Sim';
                    
                    // Determinar se esta é a posição "Atual" (última posição numérica)
                    const posicaoNumero = Number(membro.posicao);
                    const isPosicaoAtual = !isNaN(posicaoNumero) && posicaoNumero === maiorPosicao;
                    const exibirPosicao = isPosicaoAtual ? 'Atual' : (membro.posicao || 'Não informado');
                    
                    const RowContent = (
                      <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                        {/* Foto */}
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                            {membro.foto ? (
                              <img
                                src={membro.foto}
                                alt={membro.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <FaGraduationCap className="text-gray-400 text-lg" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Nome */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-lg text-gray-900 truncate ${isMembro ? 'hover:text-altm-gold-600 transition-colors' : ''}`}>
                            {membro.title}
                          </h3>
                          {isMembro && (
                            <p className="text-sm text-altm-gold-600 mt-1">
                              Clique para ver perfil
                            </p>
                          )}
                        </div>

                        {/* Posição */}
                        <div className="flex-shrink-0 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {exibirPosicao}
                          </span>
                        </div>
                      </div>
                    );

                    // Se for membro da academia, retorna com link, senão sem link
                    return isMembro ? (
                      <Link
                        key={membro.id}
                        to={`/academicos/${membro.id}`}
                        className="block hover:shadow-md transition-shadow"
                      >
                        {RowContent}
                      </Link>
                    ) : (
                      <div key={membro.id}>
                        {RowContent}
                      </div>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </div>

          {/* Mensagem quando não há resultados */}
          {membrosAgrupados.length === 0 && (
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
    </>
  )
}