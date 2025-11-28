import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import { IGaleria } from "./types/IGaleria";
import { IGaleriaVideo } from "./types/IGaleriaVideo";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaImages, FaCameraRetro, FaRedo } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import logoAltm from "@/assets/logo-altm.png";

const GalleryCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <Skeleton className="aspect-video w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </Card>
);

const normalizeVideoEmbedUrl = (url: string) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    // YouTube padrão: https://www.youtube.com/watch?v=ID
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }

    // YouTube curto: https://youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo simples
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return url;
  } catch {
    return url;
  }
};

export default function FotosEVideos() {
  const {
    data: galerias,
    loading,
    error,
    refetch,
  } = useContent<IGaleria>("/galeria");

  // NOVO: galeria de vídeos em endpoint separado
  const { data: galeriasVideos, loading: loadingVideos } =
    useContent<IGaleriaVideo>("/galeria-videos");

  const albums = useMemo(() => galerias ?? [], [galerias]);

  const albumsComFotos = useMemo(
    () => albums.filter((galeria) => (galeria.galeria?.length || 0) > 0),
    [albums]
  );

  const albumsComVideos = useMemo(() => galeriasVideos ?? [], [galeriasVideos]);

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title="Fotos e Vídeos"
        subtitle="Acompanhe os registros fotográficos e audiovisuais da Academia de Letras do Triângulo Mineiro."
        icon={<FaImages size={50} />}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Fotos e Vídeos" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-white rounded-xl shadow-md border border-red-100 p-8 text-center mb-8">
            <FaCameraRetro className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700 mb-4">
              Não foi possível carregar a galeria no momento.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-altm-gold-600 text-white font-medium hover:bg-altm-gold-700 transition-colors gap-2"
            >
              <FaRedo className="w-4 h-4" />
              Tentar novamente
            </button>
          </div>
        )}

        <div className="space-y-14">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Galerias de Fotos
              </h2>
              <span className="text-sm text-gray-500">
                {albumsComFotos.length}{" "}
                {albumsComFotos.length === 1 ? "galeria" : "galerias"}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <GalleryCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albumsComFotos.map((galeria) => {
                  const previewImage =
                    galeria.imagem_destacada ||
                    galeria.galeria?.[0]?.url ||
                    "https://placehold.co/600x400?text=Sem+imagem";

                  return (
                    <Link
                      key={galeria.id}
                      to={`/fotos-e-videos/fotos/${galeria.id}`}
                      className="block"
                    >
                      <Card className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={previewImage}
                            alt={galeria.galeria?.[0]?.alt || galeria.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="p-6 flex flex-col gap-4 flex-1">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                              {galeria.title}
                            </h3>
                            {galeria.description && (
                              <p className="text-gray-600 text-sm line-clamp-3">
                                {galeria.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                            <span>
                              {galeria.galeria?.length || 0}{" "}
                              {galeria.galeria?.length === 1 ? "foto" : "fotos"}
                            </span>
                            <span className="text-black font-semibold">
                              Ver galeria
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Vídeos</h2>
              <span className="text-sm text-gray-500">
                {albumsComVideos.length}{" "}
                {albumsComVideos.length === 1 ? "registro" : "registros"}
              </span>
            </div>

            {loadingVideos ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <GalleryCardSkeleton key={`video-skeleton-${index}`} />
                ))}
              </div>
            ) : albumsComVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albumsComVideos.map((video) => {
                  const links = video.links_dos_videos ?? [];
                  const hasSingle = links.length === 1;
                  const hasMultiple = links.length > 1;
                  const firstLink = links[0];

                  // thumbnail: imagem destacada ou logo da ALTM
                  const thumbnail = video.imagem_destacada || logoAltm;

                  const ctaLabel = hasMultiple
                    ? `${links.length} vídeos`
                    : firstLink
                    ? "Assistir vídeo"
                    : "Em breve";

                  // 🔹 Caso 1: apenas 1 vídeo → abre lightbox (Dialog) com embed
                  if (hasSingle && firstLink) {
                    return (
                      <Dialog key={`video-${video.id}`}>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="block w-full text-left"
                          >
                            <Card className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                              <div className="aspect-video overflow-hidden relative">
                                <img
                                  src={thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-altm-gold-600 text-xl font-bold">
                                    ▶
                                  </div>
                                </div>
                              </div>

                              <div className="p-6 flex flex-col gap-4 flex-1">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                    {video.title}
                                  </h3>
                                  {video.description && (
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                      {video.description}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                                  <span>
                                    {video.date || "Vídeo institucional"}
                                  </span>
                                  <span className="text-altm-gold-600 font-semibold">
                                    {ctaLabel}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl w-full bg-black p-0">
                          <div className="aspect-video w-full">
                            <iframe
                              src={normalizeVideoEmbedUrl(firstLink)}
                              title={video.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  }

                  // 🔹 Caso 2: vários vídeos → vai para página interna /fotos-e-videos/videos/:id
                  if (hasMultiple) {
                    return (
                      <Link
                        key={`video-${video.id}`}
                        to={`/fotos-e-videos/videos/${video.id}`}
                        className="block"
                      >
                        <Card className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                          <div className="aspect-video overflow-hidden relative">
                            <img
                              src={thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-altm-gold-600 text-xl font-bold">
                                ▶
                              </div>
                            </div>
                          </div>

                          <div className="p-6 flex flex-col gap-4 flex-1">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                {video.title}
                              </h3>
                              {video.description && (
                                <p className="text-gray-600 text-sm line-clamp-3">
                                  {video.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                              <span>{video.date || "Vídeo institucional"}</span>
                              <span className="text-altm-gold-600 font-semibold">
                                {ctaLabel}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  }

                  // 🔹 Caso 3: sem links ainda → card “Em breve”
                  return (
                    <Card
                      key={`video-${video.id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col h-full opacity-75"
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm px-3 py-1 rounded-full bg-black/60">
                            Em breve
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col gap-2 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-10 text-center">
                <FaImages className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Em breve disponibilizaremos registros em vídeo.
                </p>
              </Card>
            )}
          </section>
        </div>

        {!loading &&
          !loadingVideos &&
          albumsComFotos.length === 0 &&
          albumsComVideos.length === 0 &&
          !error && (
            <div className="text-center py-20">
              <FaImages className="w-16 h-16 mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Nenhum registro encontrado
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto">
                Em breve adicionaremos novas fotos e vídeos para compartilhar
                com você os momentos especiais da Academia.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
