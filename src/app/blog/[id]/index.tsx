import { IblogId } from "@/app/home/types/IBlog";
import { useContent } from "@/hooks/useContent";
import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FaNewspaper } from "react-icons/fa";

export default function DetailsBlog() {
  const { id } = useParams();
  const { data: blogData, loading, error } = useContent<IblogId>(`/blog/${id}`);

  // Como useContent retorna um array, pegamos o primeiro item
  const blog = Array.isArray(blogData) ? blogData[0] : blogData;

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
        <div className="text-lg text-red-600">Erro ao carregar a notícia</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Notícia não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={blog.title}
        subtitle={blog.resumo || blog.summary || "Notícia da ALTM"}
        icon={<FaNewspaper />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Notícias", href: "/blog" },
          { label: blog.title },
        ]}
      />

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Imagem Destacada */}
          {blog.imagem_destacada && (
            <div className="w-full overflow-hidden bg-white">
              <img
                src={blog.imagem_destacada}
                alt={blog.title}
                className="w-full h-auto object-contain rounded-2xl"
                draggable={false}
              />
            </div>
          )}

          <div className="p-8">
            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Conteúdo HTML */}
            <div className="prose prose-lg max-w-none blog-content">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>

          {/* CSS “escopado” no conteúdo do WP */}
          <style>{`
            /* =========================================
               RESET/BASE
            ========================================== */
            .blog-content img,
            .blog-content video,
            .blog-content iframe,
            .blog-content audio {
              max-width: 100% !important;
              height: auto !important;
            }

            /* Impede floats que o WP coloca (alignleft/alignright) */
            .blog-content img,
            .blog-content figure,
            .blog-content .wp-caption,
            .blog-content .wp-block-image {
              float: none !important;
              clear: both !important;
            }

            /* =========================================
               GUTENBERG (wp-block-image)
            ========================================== */
            .blog-content figure.wp-block-image,
            .blog-content .wp-block-image,
            .blog-content figure {
              margin-left: auto !important;
              margin-right: auto !important;
              text-align: center !important;
            }

            .blog-content .wp-block-image img,
            .blog-content figure img,
            .blog-content p > img,
            .blog-content a > img {
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* =========================================
               CLASSES DE ALINHAMENTO (muito comuns)
            ========================================== */
            .blog-content .alignleft,
            .blog-content .alignright,
            .blog-content .aligncenter,
            .blog-content .alignnone {
              float: none !important;
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
              text-align: center !important;
            }

            .blog-content img.alignleft,
            .blog-content img.alignright,
            .blog-content img.aligncenter,
            .blog-content img.alignnone {
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* =========================================
               WP “antigo”: wp-caption + caption text
            ========================================== */
            .blog-content .wp-caption {
              width: auto !important;
              max-width: 100% !important;
              margin-left: auto !important;
              margin-right: auto !important;
              text-align: center !important;
            }

            .blog-content .wp-caption img {
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            .blog-content .wp-caption-text {
              text-align: center !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* =========================================
               LEGENDAS (figcaption / wp-element-caption)
            ========================================== */
            .blog-content figcaption,
            .blog-content .wp-element-caption {
              text-align: center !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* =========================================
               ÚLTIMO “seguro”: se algum wrapper vier com style inline,
               pelo menos garantimos centralização visual do conteúdo
            ========================================== */
            .blog-content p {
              overflow: hidden; /* limpa floats residuais de HTML legado */
            }
          `}</style>
        </article>

        {/* Navegação */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/"
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
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}