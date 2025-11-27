import { Link } from "react-router-dom";
import { 
  FaGraduationCap, 
  FaHistory, 
  FaBookOpen, 
  FaImages
} from "react-icons/fa";

export const Links = () => {
  const items = [
    {
      icon: FaGraduationCap,
      title: "ACADÊMICOS",
      description: "Conheça nossos membros",
      link: "/academicos-atuais"
    },
    {
      icon: FaHistory,
      title: "HISTÓRIA",
      description: "Nossa trajetória",
      link: "/sobre-a-altm/historico"
    },
    {
      icon: FaBookOpen,
      title: "BIBLIOTECA",
      description: "Acervo literário",
      link: "#"
    },
    {
      icon: FaImages,
      title: "FOTOS E VÍDEOS",
      description: "Galeria de multimídia",
      link: "/fotos-e-videos"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid de Ícones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Ícone */}
              <div className="w-16 h-16 bg-[#c1a44e] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#a68d3f] transition-colors duration-300">
                <item.icon className="w-8 h-8 text-white" />
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#c1a44e] transition-colors duration-300">
                {item.title}
              </h3>

              {/* Descrição */}
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}; 