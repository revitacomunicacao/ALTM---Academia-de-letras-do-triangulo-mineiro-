import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProgramacaoCultural } from "@/app/programacao-cultural/types/IProgramacaoCultural";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaBook, FaTimes } from "react-icons/fa";
import { useContent } from "@/hooks/useContent";
import { useMemo } from "react";

const ContentSkeleton = () => (
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
);

export default function LancamentoDeLivrosDetails() {
  const { id } = useParams();
  const { data: lancamentos, loading, error, refetch } =
    useContent<IProgramacaoCultural>("lancamento_de_livros");

  const lancamentoId = Number(id);
  const lancamento = useMemo(() => {
    if (!Number.isFinite(lancamentoId)) return null;
    return lancamentos.find((l) => l.id === lancamentoId) ?? null;
  }, [lancamentos, lancamentoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Lançamento de Livros"
          subtitle="Carregando lançamento..."
          icon={<FaBook size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Programação Cultural", href: "/programacao-cultural" },
            { label: "Lançamento de Livros", href: "/lancamento-de-livros" },
            { label: "Carregando..." },
          ]}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ContentSkeleton />
        </div>
      </div>
    );
  }

  if (error || (!loading && !lancamento)) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Lançamento de Livros"
          subtitle="Não foi possível carregar este lançamento"
          icon={<FaBook size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Programação Cultural", href: "/programacao-cultural" },
            { label: "Lançamento de Livros", href: "/lancamento-de-livros" },
            { label: "Erro" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar</h3>
            <p className="text-gray-600 mb-6">
              Não foi possível carregar as informações deste lançamento.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Tentar novamente</span>
              </button>
              <Link
                to="/lancamento-de-livros"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-altm-gold-600 font-medium rounded-lg border-2 border-altm-gold-600 hover:bg-altm-gold-600 hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={lancamento.title}
        subtitle={lancamento.subtitulo}
        icon={<FaBook size={50} />}
        imagem_topo={lancamento.imagem_topo}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Programação Cultural", href: "/programacao-cultural" },
          { label: "Lançamento de Livros", href: "/lancamento-de-livros" },
          { label: lancamento.title },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="space-y-6">
            <div className="lancamento-content prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: lancamento.content }}
                className="text-gray-700"
              />
            </div>
          </div>
        </Card>

        <style>{`
          /* Respeitar alinhamentos do Gutenberg/WP */
          .lancamento-content .has-text-align-center { text-align: center; }
          .lancamento-content .has-text-align-right { text-align: right; }
          .lancamento-content .has-text-align-left { text-align: left; }

          /* Evita que regras externas "forcem" alinhamento */
          .lancamento-content { text-align: initial; }

          /* Imagens e figuras padrão do WP */
          .lancamento-content figure,
          .lancamento-content .wp-caption {
            margin-left: auto;
            margin-right: auto;
          }

          .lancamento-content img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
            height: auto;
          }
        `}</style>

        <div className="mt-8">
          <Link
            to="/lancamento-de-livros"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-altm-gold-600 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lançamentos
          </Link>
        </div>
      </div>
    </div>
  );
}

