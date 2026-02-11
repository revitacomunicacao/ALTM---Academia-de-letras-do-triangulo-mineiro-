import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import { PageHeader } from "@/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FaBookOpen } from "react-icons/fa";
import type { IAtividadeLiterariaDetail } from "../types/IAtividadesLiterarias";

function isHtmlLike(v?: string) {
  return !!v && /<\/?[a-z][\s\S]*>/i.test(v);
}

function normalizeUrl(url?: string | null) {
  const v = (url || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function parseShortcodeAttrs(str: string): Record<string, string> {
  // captura key="value" ou key='value' ou key=value
  const attrs: Record<string, string> = {};
  const re = /(\w+)=("([^"]*)"|'([^']*)'|([^\s\]]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(str))) {
    const key = m[1];
    const value = (m[3] ?? m[4] ?? m[5] ?? "").trim();
    attrs[key] = value;
  }
  return attrs;
}

function isLikelyMediaUrl(url: string) {
  return /\.(mp4|webm|ogg|mp3|wav|m4a)(\?.*)?$/i.test(url);
}

function renderMidiaHtml(raw?: string | null): string {
  const v = (raw || "").trim();
  if (!v) return "";

  // 1) Já é HTML (iframe/video/audio/etc.)
  if (isHtmlLike(v)) return v;

  // 2) Shortcode [video ...] ou [audio ...]
  const shortcodeMatch = v.match(/^\[(video|audio)\s+([^\]]+)\]$/i) || v.match(/^\[(video|audio)\s+([^\]]+)\/\]$/i);
  if (shortcodeMatch) {
    const type = shortcodeMatch[1].toLowerCase(); // video | audio
    const attrsStr = shortcodeMatch[2] || "";
    const attrs = parseShortcodeAttrs(attrsStr);

    const src = normalizeUrl(attrs.src || "");
    const width = attrs.width ? Number(attrs.width) : undefined;
    const height = attrs.height ? Number(attrs.height) : undefined;

    if (!src) return "";

    if (type === "video") {
      // Mantém controls e deixa responsivo via CSS (width:100%, height:auto)
      return `
        <video ${width ? `width="${width}"` : ""} ${height ? `height="${height}"` : ""} controls preload="metadata">
          <source src="${src}" />
          Seu navegador não suporta vídeo.
        </video>
      `.trim();
    }

    // audio
    return `
      <audio controls preload="metadata">
        <source src="${src}" />
        Seu navegador não suporta áudio.
      </audio>
    `.trim();
  }

  // 3) Se for URL direta (mp4/mp3 etc.)
  const maybeUrl = normalizeUrl(v);
  if (maybeUrl && isLikelyMediaUrl(maybeUrl)) {
    if (/\.(mp3|wav|m4a|ogg)(\?.*)?$/i.test(maybeUrl)) {
      return `
        <audio controls preload="metadata">
          <source src="${maybeUrl}" />
          Seu navegador não suporta áudio.
        </audio>
      `.trim();
    }

    return `
      <video controls preload="metadata">
        <source src="${maybeUrl}" />
        Seu navegador não suporta vídeo.
      </video>
    `.trim();
  }

  // 4) Fallback: mostra como texto (ou vazio)
  return "";
}

export default function AtividadeLiterariaDetalhe() {
  const { id } = useParams();

  const { data, loading, error } = useContent<IAtividadeLiterariaDetail>(
    `/atividades-literarias/${id}`,
  );

  const post = Array.isArray(data) ? data[0] : data;

  // Lightbox da galeria
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const openGalleryImage = (src: string) => {
    setActiveImage(src);
    setGalleryOpen(true);
  };

  const galeria = useMemo(() => post?.galeria ?? [], [post]);

  const midiaHtml = useMemo(() => renderMidiaHtml(post?.midia), [post?.midia]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-600">Erro ao carregar a atividade</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Atividade não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={post.title}
        subtitle={post.resumo || "Atividade Literária"}
        icon={<FaBookOpen />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Atividades Literárias", href: "/atividades-literarias" },
          { label: post.title },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.capa ? (
            <div className="w-full overflow-hidden bg-white">
              <img
                src={post.capa}
                alt={post.title}
                className="w-full h-auto object-contain"
                draggable={false}
              />
            </div>
          ) : null}

          <div className="p-8 space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>

            {/* Mídia (embed/shortcode/url) */}
            {midiaHtml ? (
              <div className="rounded-xl border bg-white p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mídia
                </h3>

                <div
                  className="w-full overflow-hidden rounded-lg"
                  dangerouslySetInnerHTML={{ __html: midiaHtml }}
                />

                {/* garante responsividade do player */}
                <style>{`
                  video, audio, iframe {
                    max-width: 100%;
                  }
                  video, iframe {
                    width: 100% !important;
                    height: auto !important;
                    display: block;
                  }
                  audio {
                    width: 100%;
                  }
                `}</style>
              </div>
            ) : null}

            {/* Conteúdo */}
            {post.conteudo ? (
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.conteudo }} />
              </div>
            ) : null}

            {/* Galeria */}
            {galeria.length ? (
              <div className="rounded-xl border bg-white p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Galeria
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galeria.map((src, i) => (
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
                          alt={`${post.title} — foto ${i + 1}`}
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
          </div>
        </article>

        <div className="mt-8">
          <Link
            to="/atividades-literarias"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-[#c1a44e] transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar para Atividades Literárias
          </Link>
        </div>
      </div>

      {/* Lightbox da imagem (imagem inteira dentro do modal) */}
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

          <div className="w-full h-full flex items-center justify-center p-4">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
