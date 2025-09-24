import banner1 from "@/assets/banner1.png"
import banner2 from "@/assets/banner2.png"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { useContent } from "@/hooks/useContent"
import { useEffect, useState } from "react"
import { IBanners } from "../types/IBanners"

export const Banner = () => {

  // const banners = [
  //   {
  //     img: banner1,
  //     alt: "Banner 1 - Academia de Letras do Triângulo Mineiro"
  //   },
  //   {
  //     img: banner2,
  //     alt: "Banner 2 - Academia de Letras do Triângulo Mineiro"
  //   },
  // ]

  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const { data: banners, loading, error, refetch } = useContent<IBanners>("banners")

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if(loading) return (
    <section className="w-full overflow-hidden -mt-8">
      <div className="relative w-full">
        <Skeleton className="w-full h-[400px] rounded-none" />
        
        {/* Skeleton para as setas de navegação */}
        <div className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2">
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
        </div>
        <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2">
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
        </div>
      </div>
    </section>
  )

  return (
    <section className="w-full overflow-hidden -mt-8">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
        }}
      >
        <CarouselContent className="-ml-0">
          {banners.map(({ banner_url,id,title }) => (
            <CarouselItem key={id} className="pl-0 basis-full">
              <div className="border-0 shadow-none rounded-none w-full">
                <img
                  src={banner_url}
                  alt={title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Setas de navegação - melhoradas para responsivo */}
        <CarouselPrevious className="left-2 sm:left-4 bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 hover:scale-105" />
        <CarouselNext className="right-2 sm:right-4 bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 hover:scale-105" />
      </Carousel>
    </section>
  )
}