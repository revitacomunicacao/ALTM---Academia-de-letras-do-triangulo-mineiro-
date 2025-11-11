import { useContent } from "@/hooks/useContent"
import { IHistorico } from "./types/IHistorico"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { FaHistory, FaTimes, FaArrowLeft, FaImages, FaFileAlt, FaExternalLinkAlt } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// Componente de skeleton para a página
const ContentSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Coluna Principal */}
    <div className="lg:col-span-2 space-y-8">
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

    {/* Coluna Lateral */}
    <div className="lg:col-span-1">
      <Card>
        <div className="space-y-6">
          <Skeleton className="h-6 w-2/3" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>
)

export default function Historico() {
  const { data: historico, loading, error, refetch } = useContent<IHistorico>("historico")

  if(loading) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Histórico"
        subtitle="Carregando informações sobre a Histórico"
        icon={<FaHistory size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sobre a ALTM", href: "/sobre-a-altm" },
          { label: "Histórico" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentSkeleton />
      </div>
    </div>
  )

  if(error) return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader 
        title="Histórico"
        subtitle="Erro ao carregar as informações"
        icon={<FaHistory size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sobre a ALTM", href: "/sobre-a-altm" },
          { label: "Histórico" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-6">Não foi possível carregar as informações sobre o histórico da ALTM.</p>
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
      {historico && historico.map(({
        description,
        galeria_de_fotos,
        galeria_de_foto,
        id,
        imagem_topo,
        subtitulo,
        title,
        memoria_da_altm
      }) => {
        const galeriaItens = (galeria_de_foto && galeria_de_foto.length > 0
          ? galeria_de_foto.filter(item => item?.foto)
          : (galeria_de_fotos || []).filter(Boolean).map(foto => ({ titulo: "", foto }))
        );

        return (
          <div key={id}>
            <PageHeader
              title={title} 
              subtitle={subtitulo}
              icon={<FaHistory size={50} />}
              imagem_topo={imagem_topo}
              breadcrumb={[
                { label: "Home", href: "/" },
                { label: "Sobre a ALTM", href: "/sobre-a-altm" },
                { label: "Histórico" }
              ]}
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal (Esquerda) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Descrição */}
                  <Card>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6 justify-center">
                        <h2 className="text-2xl text-center font-bold text-gray-800">Histórico</h2>
                      </div>
                      
                      <div className="prose max-w-none">
                        <div 
                          dangerouslySetInnerHTML={{ __html: description }}
                          className="text-gray-700 leading-relaxed"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Galeria de Fotos */}
                  {galeriaItens.length > 0 && (
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
                              {galeriaItens.map((item, index) => (
                                <CarouselItem key={`${item.foto}-${index}`} className="md:basis-1/2 lg:basis-1/3">
                                  <div className="flex flex-col items-center gap-3">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <div className="aspect-square w-full overflow-hidden rounded-lg group cursor-pointer">
                                          <img
                                            src={item.foto}
                                            alt={item.titulo || `Foto histórica ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          />
                                        </div>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl w-full p-0">
                                        <div className="relative">
                                          <img
                                            src={item.foto}
                                            alt={item.titulo || `Foto histórica ${index + 1}`}
                                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                          />
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    {item.titulo && item.titulo.trim() && (
                                      <p className="text-sm text-center text-gray-700">{item.titulo}</p>
                                    )}
                                  </div>
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

                {/* Coluna Lateral (Direita) - Memória da ALTM */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                        <FaFileAlt className="text-altm-gold-600 text-xl" />
                        <h2 className="text-xl font-bold text-gray-800">Memória da ALTM</h2>
                      </div>
                      
                      {memoria_da_altm && memoria_da_altm.length > 0 ? (
                        <div className="space-y-3">
                          {memoria_da_altm.map((item, index) => (
                            <a
                              key={index}
                              href={item.arquivo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-altm-gold-50 transition-all duration-200 border border-transparent hover:border-altm-gold-200"
                            >
                              <FaFileAlt className="text-altm-gold-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 group-hover:text-altm-gold-700 transition-colors line-clamp-2">
                                  {item.titulo}
                                </h3>
                              </div>
                              <FaExternalLinkAlt className="text-gray-400 group-hover:text-altm-gold-600 text-xs mt-1 flex-shrink-0 transition-colors" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhum documento disponível no momento.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}