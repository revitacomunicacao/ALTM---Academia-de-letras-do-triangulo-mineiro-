import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent } from "@/hooks/useContent";
import { IBlocosHome } from "../types/IBlocosHome";

export const ConhecaAltm = () => {
  const { data: blocos, loading } = useContent<IBlocosHome>("/blocos-da-home");

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

  return (
    <section className="py-7 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {blocos.map((bloco) => (
            <Link
              key={bloco.id}
              to={bloco.link || "#"}
              className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
            >
              {/* Imagem Quadrada */}
              <div className="w-full h-[150px] aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={bloco.imagem}
                  alt={bloco.title}
                  className="w-full h-[150px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Título */}
              <h3 className="mt-4 text-lg font-bold text-gray-900 text-center group-hover:text-[#c1a44e] transition-colors duration-300">
                {bloco.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
