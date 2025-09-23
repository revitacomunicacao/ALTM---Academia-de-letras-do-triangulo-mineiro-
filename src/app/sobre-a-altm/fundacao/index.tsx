import { useContent } from "@/hooks/useContent"
import { IFundacao } from "./types/IFundacao"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaBuilding, FaTimes, FaArrowLeft, FaImages } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// Componente de skeleton para a página
const ContentSkeleton = () => (
  <div className="space-y-8">
    <Card>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
      </div>
    </Card>
    
    <Card>
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/3" />
        <div className="relative">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  </div>
)

export default function Fundacao() {
  const { data: fundacao, loading, error, refetch } = useContent<IFundacao>("fundacao")

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Fundação"
        subtitle="Carregando informações sobre a fundação da ALTM"
        icon={<FaBuilding size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sobre a ALTM", href: "/sobre-a-altm" },
          { label: "Fundação" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentSkeleton />
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Fundação"
        subtitle="Erro ao carregar as informações"
        icon={<FaBuilding size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sobre a ALTM", href: "/sobre-a-altm" },
          { label: "Fundação" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações sobre a fundação da ALTM.</p>
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Tentar novamente</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-altm-page">
      {fundacao && fundacao.map(({
        description,
        galeria_de_fotos,
        id,
        imagem_topo,
        subtitulo,
        title
      }) => (
        <div key={id}>
          <PageHeader
            title={title} 
            subtitle={subtitulo}
            icon={<FaBuilding size={50} />}
            imagem_topo={imagem_topo}
            breadcrumb={[
              { label: "Home", href: "/" },
              { label: "Sobre a ALTM", href: "/sobre-a-altm" },
              { label: "Fundação" }
            ]}
          />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Descrição */}
              <Card>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6 justify-center">
                    <h2 className="text-2xl text-center font-bold text-gray-800">Fundação da ALTM</h2>
                  </div>
                  
                  <div className="prose max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: description }}
                      className="text-gray-700 leading-relaxed break-words"
                    />
                  </div>
                </div>
              </Card>

              {/* Galeria de Fotos */}
              {galeria_de_fotos && galeria_de_fotos.length > 0 && (
                <Card>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6 justify-center">
                      <h2 className="text-2xl font-bold text-gray-800">Galeria</h2>
                    </div>
                    
                    <div className="relative">
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full"
                      >
                        <CarouselContent>
                          {galeria_de_fotos.map((foto, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="aspect-square overflow-hidden rounded-lg group cursor-pointer">
                                    <img 
                                      src={foto} 
                                      alt={`Foto da fundação ${index + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl w-full p-0">
                                  <div className="relative">
                                    <img 
                                      src={foto} 
                                      alt={`Foto da fundação ${index + 1}`}
                                      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 left-2 sm:left-4 hover:scale-105" />
                        <CarouselNext className="bg-white/90 hover:bg-white border-altm-gold-600 text-altm-gold-600 hover:text-altm-gold-700 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 right-2 sm:right-4 hover:scale-105" />
                      </Carousel>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
