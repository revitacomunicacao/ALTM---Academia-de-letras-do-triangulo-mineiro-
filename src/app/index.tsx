import useSeo from "@/hooks/useSeo"
import { Banner } from "./home/components/Banner"
import { SearchSection } from "./home/components/SearchSection"
import { ConhecaAltm } from "./home/components/ConhecaAltm"
import { CarouselBlog } from "./home/components/CarouselBlog"
import { CarrosselArtigos } from "./home/components/Artigos"
import { Links } from "./home/components/Links"

export default function HomePage() {
  useSeo({
    title: "Home",
    description: "Home"
  })
  return (
    <main>
      <Banner />
      {/* <SearchSection /> */}
      <ConhecaAltm />
      <CarouselBlog />
      <CarrosselArtigos />
      <Links />
    </main>
  )
}
