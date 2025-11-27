import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { FaImages, FaCalendarAlt, FaArrowLeft, FaRedo } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import { IGaleria } from "../../types/IGaleria"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const PhotoSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <Skeleton className="h-4 w-1/2" />
  </div>
)

export default function GaleriaFotosDetalhe() {
  const { id } = useParams()
  const {
    data,
    loading,
    error,
    refetch,
  } = useContent<IGaleria>(`/galeria/${id}`)

  const galeria = useMemo(() => data?.[0], [data])

  const galleryPhotos = galeria?.galeria ?? []

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={galeria?.title || "Galeria de Fotos"}
        icon={<FaImages size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Fotos e Vídeos", href: "/fotos-e-videos" },
          { label: galeria?.title || "Galeria" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {error && (
          <Card className="p-10 text-center border border-red-100">
            <p className="text-gray-700 mb-4">
              Não foi possível carregar esta galeria.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-altm-gold-600 text-white font-medium hover:bg-altm-gold-700 transition-colors"
            >
              <FaRedo className="w-4 h-4" />
              Tentar novamente
            </button>
          </Card>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <PhotoSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && galeria && (
          <>
            <Card className="p-6 md:p-10 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {galeria.title}
                  </h2>
                </div>
                {galeria.date && (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                    <FaCalendarAlt className="w-4 h-4 text-altm-gold-600" />
                    {galeria.date}
                  </span>
                )}
              </div>

              {galeria.content && (
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: galeria.content }} />
                </div>
              )}
            </Card>

            <div>
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/fotos-e-videos"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-altm-gold-600 hover:text-altm-gold-700 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Voltar para fotos e vídeos
                </Link>
              </div>

              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryPhotos.map((foto) => (
                    <Card
                      key={foto.id}
                      className="bg-white overflow-hidden rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-full text-left">
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={foto.url}
                                alt={foto.alt || foto.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-4">
                              {foto.caption && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {foto.caption}
                                </p>
                              )}
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl w-full bg-white p-0">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-center p-4">
                              <img
                                src={foto.url}
                                alt={foto.alt || foto.title}
                                className="max-h-[80vh] w-auto rounded-lg object-contain"
                              />
                            </div>
                            <div className="p-4">
                              {foto.caption && (
                                <p className="text-sm text-gray-600">
                                  {foto.caption}
                                </p>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-10 text-center">
                  <FaImages className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Nenhuma foto disponível nesta galeria no momento.
                  </p>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

