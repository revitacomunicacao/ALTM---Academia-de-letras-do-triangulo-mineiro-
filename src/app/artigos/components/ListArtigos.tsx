import { useContent } from "@/hooks/useContent"
import { IArtigos } from "../types/IArtigos"

export const ListArtigos = () => {
  const { data: artigos, loading, error, refetch } = useContent<IArtigos>("/artigos");

  return (
    <section className="flex flex-col justify-center items-center">
      <div className="w-[1200px] mt-35 flex flex-col gap-5">
        <h1 className="text-[40px] font-semibold text-center">Artigos</h1>
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
    </section>
  )
}