import { IArtigos } from "@/app/artigos/types/IArtigos"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useContent } from "@/hooks/useContent"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FaBookOpen, FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"

// Componente de skeleton para o carrossel
const ArticleCardSkeleton = () => (
  <Card className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
)

export const CarrosselArtigos = () => {
  const { data: artigos, loading, error, refetch } = useContent<IArtigos>("/artigos")
  
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
              {[...Array(3)].map((_, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <ArticleCardSkeleton />
                </CarouselItem>
              ))}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar artigos</h3>
            <p className="text-gray-600 mb-6">Não foi possível carregar os artigos no momento.</p>
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
            >
              <FaBookOpen className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-16 bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Artigos</h2>
          </div>
        </div>

        {/* Carrossel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true
          }}
          className="w-full"
        >
          <CarouselContent>
            {artigos.map((
              { 
                academico,
                date,
                id,
                resumo,
                title 
              }) => (
                <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div>
                      <div className="bg-white p-6">
                        {/* Header do card com foto e nome */}
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="relative">
                            <img 
                              src={academico.foto} 
                              alt={`foto do academico ${academico.nome}`} 
                              className="w-16 h-16 object-cover rounded-full border-2 border-altm-gold-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-altm-gold-600 rounded-full flex items-center justify-center">
                              <FaUser className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                              {academico.nome}
                            </h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <FaCalendarAlt className="w-3 h-3" />
                              <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Título do artigo */}
                        <div className="mb-4">
                          <h4 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-altm-gold-600 transition-colors">
                            {title}
                          </h4>
                        </div>

                        {/* Resumo */}
                        {resumo && (
                          <div className="mb-6">
                            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                              {resumo}
                            </p>
                          </div>
                        )}

                      </div>


                      {/* Botão de leia mais */}
                      <Link 
                        to={`/artigos/${id}`}
                        className="inline-flex items-center space-x-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-altm-gold-500 to-altm-gold-600 text-white font-medium rounded-lg hover:from-altm-gold-600 hover:to-altm-gold-700 transition-all duration-300 group-hover:shadow-lg"
                      >
                        <span className="text-black">Ler Artigo</span>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>
          {/* Setas de navegação - responsivas */}
          <CarouselPrevious className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 -left-2 sm:-left-6 hover:scale-105" />
          <CarouselNext className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 -right-2 sm:-right-6 hover:scale-105" />
        </Carousel>


        {/* Link para ver todos os artigos */}
        <div className="text-center mt-12">
          <Link 
            to="/artigos"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-altm-gold-600 font-semibold rounded-xl border-2 border-altm-gold-600 hover:bg-altm-gold-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaBookOpen className="w-5 h-5" />
            <span className="text-black">Ver Todos os Artigos</span>
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}