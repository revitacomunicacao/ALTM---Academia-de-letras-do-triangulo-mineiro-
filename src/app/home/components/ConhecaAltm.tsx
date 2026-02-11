import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent } from "@/hooks/useContent";
import { IBlocosHome } from "../types/IBlocosHome";

function normalizeForMatch(value: string) {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export const ConhecaAltm = () => {
  const { data: response, loading } = useContent<IBlocosHome>("/blocos-da-home");

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-full aspect-square rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const blocosData = response[0]?.blocos || [];

  return (
    <section className="py-7 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {blocosData.map((bloco, index) => {
            const titleNormalized = normalizeForMatch(bloco.titulo);

            const isRevistaConvergencia =
              titleNormalized === normalizeForMatch("REVISTA CONVERGÊNCIA");

            const isAcademiasRegionais =
              titleNormalized === normalizeForMatch("ACADEMIAS REGIONAIS");

            const to = isRevistaConvergencia
              ? "/revistas"
              : isAcademiasRegionais
              ? "/academias-regionais"
              : bloco.link || "#";

            return (
              <Link
                key={index}
                to={to}
                className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-full h-[150px] aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300 relative">
                  <img
                    src={bloco.imagem}
                    alt={bloco.titulo}
                    className="w-full h-[150px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                    <h3 className="text-sm font-bold text-white text-center group-hover:text-[#c1a44e] transition-colors duration-300">
                      {bloco.titulo}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
