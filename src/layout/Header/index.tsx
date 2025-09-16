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
                      <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100 px-4 py-2 rounded-md transition-colors">
                        {item.name}
                      </NavigationMenuTrigger>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link to={item.href} className={`${navigationMenuTriggerStyle()} px-4 py-2 rounded-md`}>
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                    
                    {item.subMenu && (
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2">
                          {item.subMenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link to={subItem.href}>
                                <NavigationMenuLink asChild>
                                  <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                                    <div className="text-sm font-medium leading-none text-gray-900">
                                      {subItem.name}
                                    </div>
                                  </div>
                                </NavigationMenuLink>
                              </Link>
                            </li>
                          ))}
                        </ul>
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