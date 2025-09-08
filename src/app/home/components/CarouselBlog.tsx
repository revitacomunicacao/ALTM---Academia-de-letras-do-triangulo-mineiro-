import { useContent } from "@/hooks/useContent"
import { Iblog } from "../types/IBlog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

export const CarouselBlog = () => {
  const { data: blog, loading, error, refetch } = useContent<Iblog>("/blog")

  if(loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="text-lg text-gray-600">Carregando notícias...</div>
    </div>
  )

  if(error) return (
    <div className="flex justify-center items-center py-12">
      <div className="text-lg text-red-600">Erro ao carregar notícias</div>
    </div>
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Últimas Notícias
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das novidades e acontecimentos da Academia de Letras do Triângulo Mineiro
          </p>
        </div>
        {/* Carrossel de notícias */}
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {blog && blog.map(({ 
              id,
              imagem_destacada,
              resumo,
              summary,
              title
            }) => (
              <CarouselItem key={id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-1 rounded-2xl">
                  <CardContent className="p-0">
                    {/* Imagem da notícia */}
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={imagem_destacada} 
                        alt={`Imagem da notícia: ${title}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Conteúdo da notícia */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {resumo || summary || "Confira esta notícia completa..."}
                      </p>
                      
                      <Link 
                        to={`/blog/${id}`}
                        className="inline-flex items-center text-[#c1a44e] hover:text-[#a68d3f] font-medium text-sm transition-colors"
                      >
                        Ler mais
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Setas de navegação */}
          <CarouselPrevious className="left-4 bg-white hover:bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 shadow-md" />
          <CarouselNext className="right-4 bg-white hover:bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 shadow-md" />
        </Carousel>

        {/* Link para ver todas as notícias */}
        <div className="text-center mt-8">
          <Link 
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-[#c1a44e] text-white font-medium rounded-lg hover:bg-[#a68d3f] transition-colors"
          >
            Ver todas as notícias
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}