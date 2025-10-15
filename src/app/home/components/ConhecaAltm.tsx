import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useContent } from "@/hooks/useContent";
import { IBlocosHome } from "../types/IBlocosHome";

export const ConhecaAltm = () => {
  const { data: blocos, loading } = useContent<IBlocosHome>("/blocos-da-home");

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="w-full aspect-square rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {blocos.map((bloco) => (
              <CarouselItem
                key={bloco.id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Link
                  to={bloco.link || "#"}
                  className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Imagem Quadrada */}
                  <div className="w-full aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={bloco.imagem}
                      alt={bloco.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Título */}
                  <h3 className="mt-4 text-lg font-bold text-gray-900 text-center group-hover:text-[#c1a44e] transition-colors duration-300">
                    {bloco.title}
                  </h3>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Setas de navegação */}
          <CarouselPrevious className="left-0 bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200" />
          <CarouselNext className="right-0 bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200" />
        </Carousel>
      </div>
    </section>
  );
};
