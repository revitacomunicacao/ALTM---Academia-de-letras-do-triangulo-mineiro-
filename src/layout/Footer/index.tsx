import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa"
import logo from "@/assets/logo-altm.png"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const menuSobreAltm = [
    { name: "Quem Somos", href: "/sobre-a-altm/quem-somos" },
    { name: "Histórico", href: "/sobre-a-altm/historico" },
    { name: "Fundação", href: "/sobre-a-altm/fundacao" },
    { name: "Estatuto", href: "/sobre-a-altm/estatuto" },
    { name: "Regimento", href: "/sobre-a-altm/regimento" },
    { name: "Academias Municipais", href: "/sobre-a-altm/academias-municipais" },
  ]

  const menuAcademicos = [
    { name: "Diretoria", href: "/academicos/diretoria" },
    { name: "Membros", href: "/academicos/membros" },
    { name: "Presidentes", href: "/academicos/presidentes" },
    { name: "Sócios Correspondentes", href: "/academicos/socios-correspondentes" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Seção principal do footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo e informações principais */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src={logo} 
                alt="Logo ALTM" 
                className="h-16 w-auto mr-3"
              />
              <div>
                <h3 className="text-lg font-bold text-white">ALTM</h3>
                <p className="text-sm text-gray-300">Academia de Letras e Artes de Taubaté e Microrregião</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Promovendo a cultura, literatura e artes na região de Taubaté desde nossa fundação.
            </p>

            {/* Redes sociais */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-altm-gold-600 p-3 rounded-full transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-altm-gold-600 p-3 rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Sobre a ALTM */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-altm-gold-400">Sobre a ALTM</h4>
            <ul className="space-y-3">
              {menuSobreAltm.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className="text-gray-300 hover:text-altm-gold-400 text-sm transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Acadêmicos */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-altm-gold-400">Acadêmicos</h4>
            <ul className="space-y-3">
              {menuAcademicos.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className="text-gray-300 hover:text-altm-gold-400 text-sm transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/artigos" 
                  className="text-gray-300 hover:text-altm-gold-400 text-sm transition-colors duration-300"
                >
                  Artigos
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-300 hover:text-altm-gold-400 text-sm transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-altm-gold-400">Contato</h4>
            <div className="space-y-4">
              
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-4 w-4 text-altm-gold-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Taubaté - SP<br />
                    Região do Vale do Paraíba
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="h-4 w-4 text-altm-gold-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">(12) 99999-9999</p>
              </div>

              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-4 w-4 text-altm-gold-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">contato@altm.org.br</p>
              </div>

              <div className="flex items-start space-x-3">
                <FaClock className="h-4 w-4 text-altm-gold-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Funcionamento:<br />
                    Segunda a Sexta: 8h às 17h
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Linha divisória */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Academia de Letras e Artes de Taubaté e Microrregião. Todos os direitos reservados.
            </div>

            <div className="flex space-x-6 text-sm">
              <Link 
                to="/fale-conosco" 
                className="text-gray-400 hover:text-altm-gold-400 transition-colors duration-300"
              >
                Fale Conosco
              </Link>
              <Link 
                to="/sobre-a-altm/estatuto" 
                className="text-gray-400 hover:text-altm-gold-400 transition-colors duration-300"
              >
                Políticas
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}