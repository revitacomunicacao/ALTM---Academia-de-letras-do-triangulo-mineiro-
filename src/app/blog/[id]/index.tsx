import { IblogId } from "@/app/home/types/IBlog";
import { useContent } from "@/hooks/useContent";
import { useParams, Link } from "react-router-dom";

export default function DetailsBlog (){

  const { id } = useParams()
  const { data: blogData, loading, error, refetch } = useContent<IblogId>(`/blog/${id}`)
  
  // Como useContent retorna um array, pegamos o primeiro item
  const blog = Array.isArray(blogData) ? blogData[0] : blogData

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-600">Erro ao carregar o post</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Post não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Imagem Destacada */}
          {blog.imagem_destacada && (
            <div className="w-full overflow-hidden">
              <img
                src={blog.imagem_destacada}
                alt={blog.title}
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          )}

          <div className="p-8">
            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Conteúdo HTML */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>
        </article>

        {/* Navegação */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-[#c1a44e] transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Blog
          </Link>

        </div>
      </div>
    </div>
  )
}