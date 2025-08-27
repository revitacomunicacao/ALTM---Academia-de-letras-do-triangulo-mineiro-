import useSeo from "@/hooks/useSeo"
import { Banner } from "./home/components/Banner"

export default function HomePage() {
  useSeo({
    title: "Home",
    description: "Home"
  })
  return (
    <main>
      <Banner />
    </main>
  )
}
