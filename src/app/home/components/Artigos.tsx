import { IArtigos } from "@/app/artigos/types/IArtigos"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useContent } from "@/hooks/useContent"

export const CarrosselArtigos = () => {
  const { data: artigos, loading, error, refetch } = useContent<IArtigos>("/artigos")
  console.log(artigos)
  
  return (
    <section className="flex justify-center my-10">
      <Carousel
        opts={{
          align: "start"
        }}
        className="w-[1200px]"
      >
        <CarouselContent>
          {artigos.map((
            { 
              academico,
              date,
              id,
              resumo,
              title 
            }) => (
              <CarouselItem key={id} className="basis-1/2 sm:basis-1/3">
                <div className="flex justify-center items-center flex-col gap-4">
                  <img 
                    src={academico.foto} 
                    alt={`foto do academico ${academico.nome}`} 
                    className="w-30 h-30 object-cover rounded-full"
                  />
                  <div>
                    <h2 className="text-[#c1a44e] text-[20px]">{academico.nome}</h2>
                  </div>
                  <div>
                    <a href={`/artigos/${id}`} className="text-[22px] text-black hover:underline cursor-pointer">{title}</a>
                  </div>
                  <div>
                    <p className="text-[#8d8d8d]">{date}</p>
                  </div>
                </div>
              </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}