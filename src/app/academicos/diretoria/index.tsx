import { useContent } from "@/hooks/useContent"
import { IDiretoria } from "./types/IDiretoria"
import { Link } from "react-router-dom"
import { useMemo } from "react"

export default function Diretoria() {
  const { data: diretoria, loading, error, refetch } = useContent<IDiretoria>("/diretoria")

  // Ordem específica da diretoria
  const ordemCargos = [
    "presidente",
    "secretario-geral", 
    "primeiro-secretario",
    "segundo-secretario",
    "tesoureiro"
  ]

  // Organiza a diretoria na ordem correta
  const diretoriaOrdenada = useMemo(() => {
    if (!diretoria) return []
    
    return ordemCargos.map(slug => 
      diretoria.find(item => item.slug === slug)
    ).filter(Boolean) as IDiretoria[]
  }, [diretoria])

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diretoria da ALTM</h1>
        </div>

        {/* Tabela da Diretoria */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Composição da Diretoria</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadeira
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {diretoriaOrdenada && diretoriaOrdenada.length > 0 ? (
                  diretoriaOrdenada.map((cargo) => (
                    <tr key={cargo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {cargo.title}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/academicos/membros/${cargo.membro.id}`}
                          className="text-sm font-medium text-[#c1a44e] hover:text-[#a68d3f] hover:underline transition-colors"
                        >
                          {cargo.membro.nome}
                        </Link>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {cargo.membro.cadeira}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg">Nenhum membro da diretoria encontrado</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contador */}
        {diretoriaOrdenada && diretoriaOrdenada.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {diretoriaOrdenada.length} cargo{diretoriaOrdenada.length !== 1 ? 's' : ''} na diretoria
          </div>
        )}
      </div>
    </div>
  )
} 