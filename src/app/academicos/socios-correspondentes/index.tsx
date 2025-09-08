import { useContent } from "@/hooks/useContent"
import { ISocios } from "./types/ISocios"

export default function SociosCorrespondentes() {

  const { data: socios, loading, error, refetch } = useContent<ISocios>("/socios-correspondentes")
  

  if(loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-lg text-gray-600">Carregando...</div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-lg text-red-600">Erro ao carregar dados</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sócios Correspondentes</h1>
        </div>

        {/* Lista de Sócios */}
        <div className="space-y-8">
          {socios && socios.map(({ id, socios, title }) => (
            <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-[#f5f2e8] border-b border-[#c1a44e]">
                <h2 className="text-xl font-semibold text-[#8b6f2a]">{title}</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eleição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nascimento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Falecimento
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="bg-white divide-y divide-gray-200">
                    {socios && socios.length > 0 ? (
                      socios.map(({ nome, eleicao, falecimento, nascimento, posicao }, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {nome || '-'}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {posicao ? (
                              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {posicao}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {eleicao || '-'}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {nascimento || '-'}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {falecimento || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg">Nenhum sócio encontrado nesta categoria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}