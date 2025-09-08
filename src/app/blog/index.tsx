import { useContent } from "@/hooks/useContent";
import { Iblog } from "../home/types/IBlog";
import { Link } from "react-router-dom";

export default function Blog() {
  const { data: blogs, loading, error, refetch } = useContent<Iblog>("/blog");

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Carregando posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-600">Erro ao carregar os posts</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
        </div>

        {/* Grid de Posts */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Imagem do Post */}
                {blog.imagem_destacada && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.imagem_destacada}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Conteúdo do Post */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#c1a44e] transition-colors">
                    {blog.title}
                  </h2>
                  
                  {(blog.resumo || blog.summary) && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {blog.resumo || blog.summary}
                    </p>
                  )}

                  <div className="flex items-center text-[#c1a44e] text-sm font-medium group-hover:text-[#a68d3f]">
                    <span>Ler mais</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Nenhum post encontrado</div>
          </div>
        )}
      </div>
    </div>
  )
}