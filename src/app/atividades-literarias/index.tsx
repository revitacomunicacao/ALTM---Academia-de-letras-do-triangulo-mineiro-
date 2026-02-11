import { useContent } from "@/hooks/useContent"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { FaBookOpen } from "react-icons/fa"
import type { IAtividadeLiterariaListItem } from "./types/IAtividadesLiterarias"

export default function AtividadesLiterarias() {
  const { data: posts, loading, error, refetch } =
    useContent<IAtividadeLiterariaListItem>("/atividades-literarias")

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Carregando atividades literárias...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-600">Erro ao carregar as atividades</div>
        <button
          onClick={() => refetch()}
          className="ml-4 px-4 py-2 rounded-lg bg-altm-gold-600 text-white hover:bg-altm-gold-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Atividades Literárias"
        subtitle="Publicações e registros de atividades"
        icon={<FaBookOpen />}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Atividades Literárias" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/atividades-literarias/${p.id}`}
                className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {p.capa ? (
                  <div className="aspect-video overflow-hidden bg-white">
                    <img
                      src={p.capa}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-white text-gray-500 text-sm">
                    Sem capa
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#c1a44e] transition-colors">
                    {p.title}
                  </h2>

                  {p.resumo ? (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{p.resumo}</p>
                  ) : null}

                  <div className="flex items-center text-[#c1a44e] text-sm font-medium group-hover:text-[#a68d3f]">
                    <span>Ler mais</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Nenhuma atividade encontrada</div>
          </div>
        )}
      </div>
    </div>
  )
}
