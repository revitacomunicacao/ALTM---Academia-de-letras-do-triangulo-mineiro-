import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { FaImages, FaCalendarAlt, FaArrowLeft, FaRedo } from "react-icons/fa"
import { useContent } from "@/hooks/useContent"
import { IGaleriaVideo } from "../../types/IGaleriaVideo"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import logoAltm from "@/assets/logo-altm.png"

const VideoSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-video w-full rounded-2xl" />
    <Skeleton className="h-4 w-1/2" />
  </div>
)

const normalizeVideoEmbedUrl = (url: string) => {
  if (!url) return ""

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v")
      if (v) return `https://www.youtube.com/embed/${v}`
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "")
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }

    return url
  } catch {
    return url
  }
}

export default function GaleriaVideosDetalhe() {
  const { id } = useParams()

  const {
    data,
    loading,
    error,
    refetch,
  } = useContent<IGaleriaVideo>(`/galeria-videos/${id}`)

  const galeria = useMemo(() => data?.[0], [data])
  const videos = useMemo(
    () => galeria?.links_dos_videos ?? [],
    [galeria]
  )

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={galeria?.title || "Galeria de vídeos"}
        subtitle="Assista aos registros em vídeo da Academia de Letras do Triângulo Mineiro."
        icon={<FaImages size={50} />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Fotos e Vídeos", href: "/fotos-e-videos" },
          { label: galeria?.title || "Galeria de vídeos" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {error && (
          <Card className="p-10 text-center border border-red-100">
            <p className="text-gray-700 mb-4">
              Não foi possível carregar esta galeria de vídeos.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-altm-gold-600 text-white font-medium hover:bg-altm-gold-700 transition-colors"
            >
              <FaRedo className="w-4 h-4" />
              Tentar novamente
            </button>
          </Card>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <VideoSkeleton key={index} />
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

              {galeria.description && (
                <p className="text-gray-700 leading-relaxed">
                  {galeria.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 mt-4">
                <Link
                  to="/fotos-e-videos"
                  className="inline-flex items-center gap-2 text-sm font-medium text-altm-gold-600 hover:text-altm-gold-700 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Voltar para fotos e vídeos
                </Link>
              </div>
            </Card>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((link, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="w-full text-left"
                      >
                        <Card className="bg-white overflow-hidden rounded-2xl shadow hover:shadow-lg transition-shadow duration-300">
                          <div className="aspect-video overflow-hidden relative">
                            <img
                              src={galeria.imagem_destacada || logoAltm}
                              alt={galeria.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-altm-gold-600 text-lg font-bold">
                                ▶
                              </div>
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              Vídeo {index + 1}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {link}
                            </p>
                          </div>
                        </Card>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl w-full bg-black p-0">
                      <div className="aspect-video w-full">
                        <iframe
                          src={normalizeVideoEmbedUrl(link)}
                          title={`Vídeo ${index + 1} - ${galeria.title}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center">
                <FaImages className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Nenhum vídeo disponível nesta galeria no momento.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
