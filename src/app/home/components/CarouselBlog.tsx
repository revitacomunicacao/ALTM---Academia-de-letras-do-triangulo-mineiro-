import { useContent } from "@/hooks/useContent"
import { Iblog } from "../types/IBlog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FaNewspaper, FaCalendarAlt, FaArrowRight, FaTimes } from "react-icons/fa"
import { Link } from "react-router-dom"

// Componente de skeleton para o carrossel de blog
const BlogCardSkeleton = () => (
  <Card className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
    <Skeleton className="aspect-video w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
)

export const CarouselBlog = () => {
  const { data: blog, loading, error, refetch } = useContent<Iblog>("/blog")

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              <CarouselItem className="basis-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 -left-2 sm:-left-6 hover:scale-105" />
            <CarouselNext className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 -right-2 sm:-right-6 hover:scale-105" />
          </Carousel>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar notícias</h3>
            <p className="text-gray-600 mb-6">Não foi possível carregar as notícias no momento.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
            >
              <FaNewspaper className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Agrupar itens de 6 em 6
  const groupedBlogs = blog.reduce((acc: Iblog[][], item, index) => {
    const groupIndex = Math.floor(index / 6)
    if (!acc[groupIndex]) {
      acc[groupIndex] = []
    }
    acc[groupIndex].push(item)
    return acc
  }, [])

  return (
    <section className="py-7 bg-[#F2ECD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carrossel de notícias */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {groupedBlogs.map((group, groupIndex) => (
              <CarouselItem key={groupIndex} className="basis-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.map(({ id, imagem_destacada, resumo, summary, title }) => (
                    <div key={id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-[500px]">
                      {/* Imagem da notícia (clicável) */}
                      <Link to={`/blog/${id}`} className="block aspect-video overflow-hidden relative bg-white">
                        <img
                          src={imagem_destacada}
                          alt={`Imagem da notícia: ${title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 bg-white">
                          <div className="flex items-center space-x-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                            <FaNewspaper className="w-3 h-3 text-altm-gold-600" />
                            <span className="text-xs font-medium text-gray-700">Notícia</span>
                          </div>
                        </div>
                      </Link>

                      {/* Conteúdo da notícia */}
                      <div className="flex flex-col justify-between">
                        <div className="bg-white p-6 h-[200px]">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            <Link
                              to={`/blog/${id}`}
                              className="block line-clamp-2 group-hover:text-altm-gold-600 transition-colors"
                            >
                              {title}
                            </Link>
                          </h3>

                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                            {resumo || summary || "Confira esta notícia completa..."}
                          </p>
                        </div>

                        <Link
                          to={`/blog/${id}`}
                          className="inline-flex items-center space-x-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-altm-gold-500 to-altm-gold-600 text-white font-medium rounded-lg hover:from-altm-gold-600 hover:to-altm-gold-700 transition-all duration-300 group-hover:shadow-lg"
                        >
                          <span className="text-black">Ler Notícia</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Setas de navegação - responsivas */}
          <CarouselPrevious className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 -left-2 sm:-left-15 hover:scale-105" />

          <CarouselNext className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 -right-2 sm:-right-15 hover:scale-105" />
        </Carousel>

        {/* Link para ver todas as notícias */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-altm-gold-600 font-semibold rounded-xl border-2 border-altm-gold-600 hover:bg-altm-gold-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaNewspaper className="w-5 h-5" />
            <span className="text-black">Ver Todas as Notícias</span>
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
