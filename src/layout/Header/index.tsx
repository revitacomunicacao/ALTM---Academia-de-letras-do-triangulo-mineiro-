import logo from "@/assets/logo-altm.png"
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


export const Header = () => {
  
  const menu = [
    {
      name: "Sobre a ALTM",
      href: "#",
      subMenu:[
        {
          name: "Academias Municipais",
          href: "/sobre-a-altm/academias-municipais"
        },
        {
          name: "Estatuto",
          href: "/sobre-a-altm/estatuto"
        },
        {
          name: "Fundação",
          href: "/sobre-a-altm/fundacao"
        },
        {
          name: "Histórico",
          href: "/sobre-a-altm/historico"
        },
        {
          name: "Quem Somos",
          href: "/sobre-a-altm/quem-somos"
        },
        {
          name: "Regimento",
          href: "/sobre-a-altm/regimento"
        },
      ]
    },
    {
      name: "Acadêmicos",
      href: "#",
      subMenu: [
        {
          name: "Diretoria",
          href: "/academicos/diretoria"
        },
        {
          name: "Membros",
          href: "/academicos/membros"
        },
        {
          name: "Presidentes",
          href: "/academicos/presidentes"
        },
        {
          name: "Sócios Correspondentes",
          href: "/academicos/socios-correspondentes"
        },
      ]
    },
    {
      name: "Fale Conosco",
      href: "/fale-conosco"
    }
  ] 

  return (
    <header className="bg-white shadow-md border-b border-gray-200 relative z-50">
      {/* Barra superior com redes sociais */}
      <div className="bg-[#c3a855] py-2 h-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-end items-center h-full">
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-8 w-8" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal com logo e navegação */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-25 relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Posicionado para "vazar" */}
          <div className="flex-shrink-0 -mb-5 relative z-50">
            <Link to="/" className="block">
              <img 
                src={logo} 
                alt="Logo Academia de letras do triangulo mineiro"
              />
            </Link>
          </div>

          {/* Navigation Menu - Centralizado */}
          <nav className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-40">
            <NavigationMenu>
              <NavigationMenuList className="space-x-8">
                {menu.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.subMenu ? (
                      <NavigationMenuTrigger className="!bg-transparent hover:shadow-lg data-[state=open]:shadow-lg !px-6 !py-3 !h-auto rounded-lg transition-all duration-300 !font-semibold !text-lg text-gray-800 border-2 border-transparent hover:border-[#be9f3c] data-[state=open]:border-[#be9f3c] hover:bg-gradient-to-br hover:from-[#be9f3c]/10 hover:to-[#be9f3c]/20 data-[state=open]:bg-gradient-to-br data-[state=open]:from-[#be9f3c]/15 data-[state=open]:to-[#be9f3c]/25 hover:text-[#be9f3c] data-[state=open]:text-[#be9f3c]">
                        {item.name}
                      </NavigationMenuTrigger>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link to={item.href} className="bg-transparent hover:shadow-lg active:shadow-lg px-6 py-3 rounded-lg transition-all duration-300 font-semibold !text-lg text-gray-800 border-2 border-transparent hover:border-[#be9f3c] active:border-[#be9f3c] inline-flex items-center justify-center hover:bg-gradient-to-br hover:from-[#be9f3c]/10 hover:to-[#be9f3c]/20 active:bg-gradient-to-br active:from-[#be9f3c]/15 active:to-[#be9f3c]/25 hover:text-[#be9f3c] active:text-[#be9f3c]">
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                    
                    {item.subMenu && (
                      <NavigationMenuContent>
                        <div className="w-[360px] md:w-[480px] bg-white border-2 border-[#be9f3c]/30 rounded-xl shadow-2xl p-2 backdrop-blur-sm">
                          <ul className="grid gap-2 p-4 md:grid-cols-2">
                            {item.subMenu.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link to={subItem.href}>
                                  <NavigationMenuLink asChild>
                                    <div className="group block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-br hover:from-[#be9f3c]/15 hover:to-[#be9f3c]/25 hover:shadow-lg hover:scale-105 focus:bg-gradient-to-br focus:from-[#be9f3c]/15 focus:to-[#be9f3c]/25 focus:shadow-lg focus:scale-105 border-2 border-transparent hover:border-[#be9f3c]/40 transform origin-center">
                                      <div className="text-base font-semibold text-gray-800 group-hover:text-[#be9f3c] transition-all duration-300 mb-1">
                                        {subItem.name}
                                      </div>
                                      <div className="h-0.5 bg-gradient-to-r from-[#be9f3c] to-[#be9f3c]/60 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"></div>
                                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#be9f3c] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                  </NavigationMenuLink>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Menu mobile placeholder */}
          <div className="lg:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}