import { useContentId } from "@/hooks/useContentId"
import { useParams, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import type { IMembros } from "../types/IMembros"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaGraduationCap, FaUser, FaBookOpen, FaFileAlt, FaCalendarAlt, FaTimes, FaMapMarkerAlt, FaBirthdayCake, FaHeart, FaCrown, FaArrowLeft } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import banner from "@/assets/background.jpg"

type TabType = 'perfil' | 'biografia' | 'bibliografia' | 'textos' | "Discurso de posse"

// Componente de skeleton para a sidebar
const SidebarSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
    <div className="flex flex-col items-center space-y-6">
      <Skeleton className="w-64 h-80 rounded-xl" />
      <Skeleton className="h-8 w-3/4" />
      <div className="w-full space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  </div>
)

// Componente de skeleton para o conteúdo
const ContentSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
    <Skeleton className="h-8 w-1/3 mb-6" />
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg">
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
)

// Componente de skeleton para biografia/bibliografia
const TextContentSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
    <Skeleton className="h-8 w-1/3 mb-6" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-10/12" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-9/12" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-8/12" />
    </div>
  </div>
)

export default function MembroDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<TabType>('perfil')

  const { data: membro, loading, error } = useContentId<IMembros>("/membros", Number(id))

  // Detecta hash na URL para abrir aba específica
  useEffect(() => {
    if (location.hash && membro) {
      const hash = location.hash.substring(1); // Remove o #
      let targetTab: TabType = 'perfil';
      
      switch (hash) {
        case 'discurso-de-posse':
          targetTab = 'Discurso de posse';
          break;
        case 'biografia':
          targetTab = 'biografia';
          break;
        case 'bibliografia':
          targetTab = 'bibliografia';
          break;
        case 'textos-escolhidos':
          targetTab = 'textos';
          break;
        default:
          targetTab = 'perfil';
      }
      
      setActiveTab(targetTab);
      
      // Scroll suave para o topo da página depois de um pequeno delay
      // para garantir que o conteúdo foi renderizado
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    } else if (!location.hash) {
      // Se não há hash, volta para perfil
      setActiveTab('perfil');
    }
  }, [location.hash, location.pathname, membro]);

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Carregando..."
        subtitle="Buscando informações do membro"
        imagem_topo={banner}
        icon={<FaGraduationCap size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros", href: "/academicos/membros" },
          { label: "Carregando..." }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SidebarSkeleton />
          </div>
          <div className="lg:col-span-2">
            <ContentSkeleton />
          </div>
        </div>
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Erro ao carregar"
        imagem_topo={banner}
        subtitle="Não foi possível carregar as informações do membro"
        icon={<FaGraduationCap size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros", href: "/academicos/membros" },
          { label: "Erro" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações do membro.</p>
          <a
            href="/academicos/membros"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Voltar aos membros</span>
          </a>
        </div>
      </div>
    </div>
  )

  if(!membro) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Membro não encontrado"
        subtitle="O membro solicitado não foi encontrado"
        imagem_topo={banner}
        icon={<FaGraduationCap size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros", href: "/academicos/membros" },
          { label: "Não encontrado" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Membro não encontrado</h3>
          <p className="text-gray-600 mb-6">O membro solicitado não foi encontrado em nossa base de dados.</p>
          <a
            href="/academicos/membros"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Voltar aos membros</span>
          </a>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'perfil':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-altm-gold-600 rounded-lg">
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Perfil do Acadêmico</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {membro.cadeira && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCrown className="w-4 h-4 text-altm-gold-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Cadeira</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.cadeira}</p>
                </div>
              )}
              
              {membro.posicao && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-altm-gold-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Posição</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.posicao}</p>
                </div>
              )}
              
              {membro.naturalidade && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-altm-gold-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Naturalidade</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.naturalidade}</p>
                </div>
              )}
              
              {membro.data_de_nascimento && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBirthdayCake className="w-4 h-4 text-altm-gold-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Data de Nascimento</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.data_de_nascimento}</p>
                </div>
              )}
              
              {membro.data_de_falecimento && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaHeart className="w-4 h-4 text-gray-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Data de Falecimento</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.data_de_falecimento}</p>
                </div>
              )}
              
              {membro.local_de_falecimento && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Local de Falecimento</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.local_de_falecimento}</p>
                </div>
              )}
              
              {membro.data_de_posse && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCalendarAlt className="w-4 h-4 text-altm-gold-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Data de Posse</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.data_de_posse}</p>
                </div>
              )}
              
              {membro.antecedido_por && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaArrowLeft className="w-4 h-4 text-gray-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Antecedido por</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.antecedido_por}</p>
                </div>
              )}
              
              {membro.sucedido_por && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaArrowLeft className="w-4 h-4 text-gray-600 rotate-180" />
                    <h3 className="font-medium text-gray-700 text-sm">Sucedido por</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.sucedido_por}</p>
                </div>
              )}
              
              {membro.academico_que_o_recebeu && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaGraduationCap className="w-4 h-4 text-altm-gold-600" />
                    <h3 className="font-medium text-gray-700 text-sm">Acadêmico que o recebeu</h3>
                  </div>
                  <p className="text-gray-900 font-medium">{membro.academico_que_o_recebeu}</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'biografia':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-altm-gold-600 rounded-lg ">
                <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Biografia</h2>
            </div>
            
            {membro.biografia ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="prose prose-sm sm:prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: membro.biografia }} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBookOpen className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Biografia não disponível</h3>
                <p className="text-gray-600 text-sm">As informações biográficas ainda não foram adicionadas para este membro.</p>
              </div>
            )}
          </div>
        )
      
      case 'bibliografia':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-altm-gold-600 rounded-lg">
                <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Bibliografia</h2>
            </div>
            
            {membro.bibliografia ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="prose prose-sm sm:prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: membro.bibliografia }} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bibliografia não disponível</h3>
                <p className="text-gray-600 text-sm">As informações bibliográficas ainda não foram adicionadas para este membro.</p>
              </div>
            )}
          </div>
        )
      
      case 'textos':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-altm-gold-600 rounded-lg">
                <FaFileAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Textos Escolhidos</h2>
            </div>
            
            {membro.textos_escolhidos ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="prose prose-sm sm:prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: membro.textos_escolhidos }} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Textos escolhidos não disponíveis</h3>
                <p className="text-gray-600 text-sm">Os textos escolhidos ainda não foram adicionados para este membro.</p>
              </div>
            )}
          </div>
        )
      
      case 'Discurso de posse':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 bg-altm-gold-600 rounded-lg">
                <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Discurso de Posse</h2>
            </div>
            
            {membro.discurso_de_posse ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="prose prose-sm sm:prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: membro.discurso_de_posse }} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGraduationCap className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discurso de posse não disponível</h3>
                <p className="text-gray-600 text-sm">O discurso de posse ainda não foi adicionado para este membro.</p>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
      <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title={membro.title}
        subtitle={`Cadeira ${membro.cadeira || 'N/A'} • ${membro.posicao || 'Membro'}`}
        icon={<FaGraduationCap size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acadêmicos", href: "/academicos" },
          { label: "Membros", href: "/academicos/membros" },
          { label: membro.title }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Coluna Esquerda - Foto e Menu */}
          <div className="lg:col-span-1">
            <Card sticky minHeight="500px" className="p-4 sm:p-6">
              {/* Foto */}
              {membro.foto ? (
                <div className="mb-6 flex flex-col justify-center items-center">
                  <div className="relative group">
                    <img 
                      src={membro.foto} 
                      alt={membro.title}
                      className="w-56 h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex flex-col justify-center items-center">
                  <div className="w-56 h-64 bg-gray-100 rounded-lg shadow-md flex items-center justify-center">
                    <FaGraduationCap className="text-gray-400 text-5xl" />
                  </div>
                </div>
              )}
              
              {/* Nome */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                  {membro.title}
                </h1>
                {membro.cadeira && (
                  <p className="text-altm-gold-600 font-semibold">
                    Cadeira {membro.cadeira}
                  </p>
                )}
                {membro.posicao && (
                  <p className="text-gray-600 text-sm mt-1">
                    {membro.posicao}
                  </p>
                )}
              </div>
              
              {/* Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    activeTab === 'perfil'
                      ? 'bg-altm-gold-100 text-altm-gold-800 shadow-md border-2 border-altm-gold-600'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <FaUser className={`w-4 h-4 ${activeTab === 'perfil' ? 'text-altm-gold-600' : 'text-altm-gold-600'}`} />
                  <span className="font-medium text-sm">Perfil do Acadêmico</span>
                </button>
                
                {membro.biografia && (
                  <button
                    onClick={() => setActiveTab('biografia')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === 'biografia'
                        ? 'bg-altm-gold-100 text-altm-gold-800 shadow-md border-2 border-altm-gold-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <FaBookOpen className={`w-4 h-4 ${activeTab === 'biografia' ? 'text-altm-gold-600' : 'text-gray-600'}`} />
                    <span className="font-medium text-sm">Biografia</span>
                  </button>
                )}
                
                {membro.bibliografia && (
                  <button
                    onClick={() => setActiveTab('bibliografia')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === 'bibliografia'
                        ? 'bg-altm-gold-100 text-altm-gold-800 shadow-md border-2 border-altm-gold-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <FaFileAlt className={`w-4 h-4 ${activeTab === 'bibliografia' ? 'text-altm-gold-600' : 'text-gray-600'}`} />
                    <span className="font-medium text-sm">Bibliografia</span>
                  </button>
                )}
                
                {membro.textos_escolhidos && (
                  <button
                    onClick={() => setActiveTab('textos')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === 'textos'
                        ? 'bg-altm-gold-100 text-altm-gold-800 shadow-md border-2 border-altm-gold-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <FaFileAlt className={`w-4 h-4 ${activeTab === 'textos' ? 'text-altm-gold-600' : 'text-gray-600'}`} />
                    <span className="font-medium text-sm">Textos Escolhidos</span>
                  </button>
                )}
                
                {membro.discurso_de_posse && (
                  <button
                    onClick={() => setActiveTab('Discurso de posse')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === 'Discurso de posse'
                        ? 'bg-altm-gold-100 text-altm-gold-800 shadow-md border-2 border-altm-gold-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <FaGraduationCap className={`w-4 h-4 ${activeTab === 'Discurso de posse' ? 'text-altm-gold-600' : 'text-gray-600'}`} />
                    <span className="font-medium text-sm">Discurso de Posse</span>
                  </button>
                )}
              </nav>
            </Card>
          </div>
          
          {/* Coluna Direita - Conteúdo */}
          <div className="lg:col-span-2">
            <Card minHeight="500px" className="p-4 sm:p-6 lg:p-8 pt-2 sm:pt-4 lg:pt-6">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}