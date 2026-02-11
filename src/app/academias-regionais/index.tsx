import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FaLandmark } from "react-icons/fa";
import { useContent } from "@/hooks/useContent";

import type {
  IAcademiasRegionaisPage,
  IAcademiaRegionalItem,
} from "./types/IAcademiasRegionais";

const PageSkeleton = () => (
  <div className="min-h-screen bg-altm-page">
    <PageHeader
      title="Academias Regionais"
      subtitle="Carregando academias..."
      icon={<FaLandmark size={46} />}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Academias Regionais", href: "/academias-regionais" },
      ]}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[3/4] rounded-lg" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

function normalizeUrl(url?: string | null) {
  const v = (url || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

// Garantia: se por algum motivo o objeto não tiver "link" (runtime),
// ainda tentamos achar variantes.
function getAcademiaLink(item: unknown): string {
  const anyItem = item as any;
  return (
    normalizeUrl(anyItem?.link) ||
    normalizeUrl(anyItem?.url) ||
    normalizeUrl(anyItem?.site) ||
    normalizeUrl(anyItem?.website) ||
    ""
  );
}

export default function AcademiasRegionais() {
  // ✅ useContent retorna array
  const { data, loading, error, refetch } = useContent<IAcademiasRegionaisPage>(
    "/academias-regionais",
  );
  const page = data?.[0];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IAcademiaRegionalItem | null>(null);

  // Lightbox da galeria
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const items = useMemo(() => page?.academias ?? [], [page]);

  const handleOpen = (item: IAcademiaRegionalItem) => {
    setSelected(item);
    setOpen(true);
  };

  const openGalleryImage = (src: string) => {
    setActiveImage(src);
    setGalleryOpen(true);
  };

  const selectedLink = useMemo(() => getAcademiaLink(selected), [selected]);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Academias Regionais"
          subtitle="Erro ao carregar"
          icon={<FaLandmark size={46} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Academias Regionais", href: "/academias-regionais" },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Não foi possível carregar as academias.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Academias Regionais"
          subtitle="Nenhum conteúdo encontrado"
          icon={<FaLandmark size={46} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Academias Regionais", href: "/academias-regionais" },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={page.title || "Academias Regionais"}
        subtitle="Conheça as academias"
        icon={<FaLandmark size={46} />}
        imagem_topo={page.imagem_topo}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Academias Regionais", href: "/academias-regionais" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              Nenhuma academia cadastrada.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item, idx) => (
                <button
                  key={`${item.nome}-${idx}`}
                  type="button"
                  onClick={() => handleOpen(item)}
                  className="text-left group"
                  aria-label={item.nome || "Abrir academia"}
                >
                  <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-white">
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={item.nome}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                        draggable={false}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-altm-gold-600 transition-colors line-clamp-2">
                      {item.nome}
                    </p>
                    <p className="text-xs text-gray-500">Ver detalhes</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modal principal */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent
          className="p-0 overflow-hidden"
          style={{
            width: "92vw",
            maxWidth: "92vw",
            height: "90vh",
            maxHeight: "90vh",
          }}
        >
          <VisuallyHidden>
            <DialogTitle>Detalhes da Academia</DialogTitle>
            <DialogDescription>Informações e galeria.</DialogDescription>
          </VisuallyHidden>

          {!selected ? null : (
            <div className="h-full w-full overflow-auto">
              <div className="px-6 py-6 md:px-10 md:py-8">
                <div className="space-y-7">
                  {/* Header + Botão do link */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selected.nome}
                    </h2>

                    {selectedLink ? (
                      <a
                        href={selectedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-5 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors w-full md:w-auto"
                      >
                        Acessar site da academia
                      </a>
                    ) : null}
                  </div>

                  {/* Foto principal */}
                  {selected.foto ? (
                    <div className="w-full rounded-xl border bg-white overflow-hidden">
                      <div className="w-full h-[260px] md:h-[420px] flex items-center justify-center">
                        <img
                          src={selected.foto}
                          alt={selected.nome}
                          className="max-h-full max-w-full object-contain"
                          draggable={false}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Informações */}
                  {selected.informacoes ? (
                    <div className="rounded-xl border bg-white p-6 md:p-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Informações
                      </h3>
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: selected.informacoes,
                        }}
                      />
                      {selected?.link?.trim() ? (
                        <a
                          href={selected.link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <button className="bg-gray-500 p-4 rounded-full my-4 text-white">
                            Acesse o site da academia aqui
                          </button>
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Galeria (clicável -> lightbox) */}
                  {selected.galeria?.length ? (
                    <div className="rounded-xl border bg-white p-6 md:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Galeria
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selected.galeria.map((src, i) => (
                          <button
                            type="button"
                            key={`${src}-${i}`}
                            onClick={() => openGalleryImage(src)}
                            className="w-full rounded-lg border bg-gray-50 overflow-hidden hover:shadow-md transition-shadow"
                            aria-label={`Abrir imagem ${i + 1} da galeria`}
                          >
                            <div className="w-full h-44 md:h-48 flex items-center justify-center p-2">
                              <img
                                src={src}
                                alt={`${selected.nome} — foto ${i + 1}`}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                                draggable={false}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* CTA final (opcional): repetir botão no fim */}
                  {selectedLink ? (
                    <div className="pt-2">
                      <a
                        href={selectedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors w-full md:w-auto"
                      >
                        Visitar o site
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox da imagem da galeria (garante que a imagem toda caiba) */}
      <Dialog
        open={galleryOpen}
        onOpenChange={(v) => {
          setGalleryOpen(v);
          if (!v) setActiveImage(null);
        }}
      >
        <DialogContent
          className="p-0 overflow-hidden bg-black/95 border-none"
          style={{
            width: "96vw",
            maxWidth: "96vw",
            height: "92vh",
            maxHeight: "92vh",
          }}
        >
          <VisuallyHidden>
            <DialogTitle>Imagem da galeria</DialogTitle>
            <DialogDescription>Visualização ampliada</DialogDescription>
          </VisuallyHidden>

          {/* Área útil fixa para conter SEM extrapolar */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt="Imagem da galeria"
                  className="w-full h-full object-contain"
                  style={{
                    maxWidth: "calc(96vw - 2rem)",
                    maxHeight: "calc(92vh - 2rem)",
                  }}
                  draggable={false}
                />
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
