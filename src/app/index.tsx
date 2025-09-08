import useSeo from "@/hooks/useSeo"
import { Banner } from "./home/components/Banner"
import { ConhecaAltm } from "./home/components/ConhecaAltm"
import { CarouselBlog } from "./home/components/CarouselBlog"
import { CarrosselArtigos } from "./home/components/Artigos"

export default function HomePage() {
  useSeo({
    title: "Home",
    description: "Home"
  })
  return (
    <main>
      <Banner />
      <ConhecaAltm />
      <CarouselBlog />
      <CarrosselArtigos />
    </main>
  )
}
