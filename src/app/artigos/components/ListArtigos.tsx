import { useContent } from "@/hooks/useContent"
import { IArtigos } from "../types/IArtigos"
import { PageHeader } from "@/components/PageHeader"
import { FaBookOpen } from "react-icons/fa"

export const ListArtigos = () => {
  const { data: artigos, loading, error, refetch } = useContent<IArtigos>("/artigos");

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Artigos"
        subtitle="Explore os artigos e textos dos acadêmicos da Academia de Letras do Triângulo Mineiro"
        icon={<FaBookOpen />}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Artigos" }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center">
          <div className="w-full flex flex-col gap-5">
        <ul className="flex flex-col gap-10">
          {artigos.map((
            { 
              academico,
              date,
              id,
              resumo,
              title 
            }, idx) => (
              <li key={idx} className="flex flex-row">
                <div className="w-1/5 flex justify-center items-center">
                  <img 
                    src={academico.foto} 
                    alt={`foto do academico ${academico.nome}`} 
                    className="w-30 h-30 object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <a href={`/artigos/${id}`} className="text-[#c0a24a] hover:underline cursor-pointer text-[20px]">{title}</a>
                  <p className="text-black text-[18px]">{academico.nome}</p>
                  <p>Publicado em: {date}</p>
                  <div dangerouslySetInnerHTML={{ __html:resumo }} />
                </div>
              </li>  
          ))}
        </ul>
          </div>
        </div>
      </div>
    </div>
  )
}