import { useContentId } from "@/hooks/useContentId"
import { useParams } from "react-router-dom"
import { useState } from "react"
import type { IMembros } from "../types/IMembros"

type TabType = 'perfil' | 'biografia' | 'bibliografia' | 'textos'

export default function MembroDetails() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<TabType>('perfil')

  const { data: membro, loading, error } = useContentId<IMembros>("/membros", Number(id))

  if(loading) return <div className="flex justify-center items-center min-h-screen">Carregando...</div>

  if(error) return <div className="flex justify-center items-center min-h-screen text-red-500">Erro ao carregar dados</div>

  if(!membro) return <div className="flex justify-center items-center min-h-screen">Membro não encontrado</div>

  const renderContent = () => {
    switch(activeTab) {
      case 'perfil':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfil do Acadêmico</h2>
            
            <div className="space-y-4">
              {membro.cadeira && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Cadeira</h3>
                  <p className="text-gray-900">{membro.cadeira}</p>
                </div>
              )}
              
              {membro.posicao && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Posição</h3>
                  <p className="text-gray-900">{membro.posicao}</p>
                </div>
              )}
              
              {membro.naturalidade && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Naturalidade</h3>
                  <p className="text-gray-900">{membro.naturalidade}</p>
                </div>
              )}
              
              {membro.data_de_nascimento && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Data de Nascimento</h3>
                  <p className="text-gray-900">{membro.data_de_nascimento}</p>
                </div>
              )}
              
              {membro.data_de_falecimento && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Data de Falecimento</h3>
                  <p className="text-gray-900">{membro.data_de_falecimento}</p>
                </div>
              )}
              
              {membro.local_de_falecimento && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Local de Falecimento</h3>
                  <p className="text-gray-900">{membro.local_de_falecimento}</p>
                </div>
              )}
              
              {membro.data_de_posse && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Data de Posse</h3>
                  <p className="text-gray-900">{membro.data_de_posse}</p>
                </div>
              )}
              
              {membro.antecedido_por && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Antecedido por</h3>
                  <p className="text-gray-900">{membro.antecedido_por}</p>
                </div>
              )}
              
              {membro.sucedido_por && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Sucedido por</h3>
                  <p className="text-gray-900">{membro.sucedido_por}</p>
                </div>
              )}
              
              {membro.academico_que_o_recebeu && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Acadêmico que o recebeu</h3>
                  <p className="text-gray-900">{membro.academico_que_o_recebeu}</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'biografia':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Biografia</h2>
            {membro.biografia ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: membro.biografia }} />
              </div>
            ) : (
              <p className="text-gray-500 italic">Biografia não disponível</p>
            )}
          </div>
        )
      
      case 'bibliografia':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bibliografia</h2>
            {membro.bibliografia ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: membro.bibliografia }} />
              </div>
            ) : (
              <p className="text-gray-500 italic">Bibliografia não disponível</p>
            )}
          </div>
        )
      
      case 'textos':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Textos Escolhidos</h2>
            {membro.textos_escolhidos ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: membro.textos_escolhidos }} />
              </div>
            ) : (
              <p className="text-gray-500 italic">Textos escolhidos não disponíveis</p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Foto e Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Foto */}
              {membro.foto && (
                <div className="mb-6 flex flex-col justify-center gap-5 items-center">
                  <img 
                    src={membro.foto} 
                    alt={membro.title}
                    className="w-64 h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Nome */}
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {membro.title}
              </h1>
              
              {/* Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'perfil'
                      ? 'bg-[#c1a44e] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Perfil do Acadêmico
                </button>
                
                {membro.biografia && (
                  <button
                    onClick={() => setActiveTab('biografia')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'biografia'
                        ? 'bg-[#c1a44e] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Biografia
                  </button>
                )}
                
                {membro.bibliografia && (
                  <button
                    onClick={() => setActiveTab('bibliografia')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'bibliografia'
                        ? 'bg-[#c1a44e] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bibliografia
                  </button>
                )}
                
                {membro.textos_escolhidos && (
                  <button
                    onClick={() => setActiveTab('textos')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'textos'
                        ? 'bg-[#c1a44e] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Textos Escolhidos
                  </button>
                )}
              </nav>
            </div>
          </div>
          
          {/* Coluna Direita - Conteúdo */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}