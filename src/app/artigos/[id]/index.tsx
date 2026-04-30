import { IArtigosId } from "../types/IArtigos";
import { useParams } from "react-router-dom";
import { useContentId } from "@/hooks/useContentId";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FaBookOpen } from "react-icons/fa";

export default function ArtigosDetails() {
  const { id } = useParams();
  const { data: artigoData, loading, error } = useContentId<IArtigosId>(
    "/artigo",
    String(id),
  );

  // Como useContentId retorna um array, pegamos o primeiro item
  const artigo = Array.isArray(artigoData) ? artigoData[0] : artigoData;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Carregando artigo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-600">Erro ao carregar o artigo</div>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-gray-600">Artigo não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={artigo.title}
        icon={<FaBookOpen />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Artigos", href: "/artigos" },
          { label: artigo.title },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Conteúdo Principal */}
          <div>
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {artigo.title}
                </h1>

                {/* Autor (linkável) */}
                <div className="-mt-4 mb-8 text-gray-600">
                  Por{" "}
                  {artigo.academico?.[0]?.id ? (
                    <Link
                      to={`/membros/${artigo.academico[0].id}`}
                      className="font-semibold text-gray-800 hover:text-[#c1a44e] transition-colors"
                    >
                      {artigo.academico[0]?.nome || "Autor"}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      {artigo.academico?.[0]?.nome || "Autor"}
                    </span>
                  )}
                </div>


                {/* Resumo */}
                {artigo.resumo && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#c1a44e]">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Resumo
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {artigo.resumo}
                    </p>
                  </div>
                )}

                {/* Conteúdo */}
                <div className="article-content prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: artigo.conteudo }} />
                </div>

                <style>{`
  /* Centraliza figuras do WP (imagem + legenda) */
  .article-content figure,
  .article-content .wp-caption {
    margin-left: auto;
    margin-right: auto;
  }

  /* Faz a imagem ficar centralizada */
  .article-content img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    height: auto;
  }

  /* Estrutura padrão do Gutenberg */
  .article-content figure {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Centraliza a legenda */
  .article-content figcaption,
  .article-content .wp-caption-text,
  .article-content .wp-element-caption {
    text-align: center;
    margin-top: 0.5rem;
    color: #6b7280; /* gray-500 */
    font-size: 0.95rem;
    line-height: 1.4;
  }
`}</style>


              </div>
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
      </div>
    </div>
  );
}
