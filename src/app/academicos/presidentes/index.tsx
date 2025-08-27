import { useContent } from "@/hooks/useContent"
import type { IPresidente } from "./types/IPresidente"
import { Link } from "react-router-dom"

export default function Presidentes() {
  const { data: presidentes, loading, error, refetch } = useContent<IPresidente>("/presidentes")

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Presidentes da ALTM</h1>
        </div>

        {/* Lista de Presidentes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Lista de Presidentes</h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {presidentes && presidentes.length > 0 ? (
              presidentes.map((presidente, idx) => (
                <li key={presidente.id || idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/academicos/membros/${presidente.presidente.id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {presidente.presidente.nome}
                      </Link>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {presidente.periodo}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center">
                <div className="text-gray-500">
                  <p className="text-lg">Nenhum presidente encontrado</p>
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Contador */}
        {presidentes && presidentes.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {presidentes.length} presidente{presidentes.length !== 1 ? 's' : ''} encontrado{presidentes.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}