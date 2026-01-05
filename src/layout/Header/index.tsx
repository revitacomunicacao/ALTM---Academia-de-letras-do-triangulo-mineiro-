import logo from "@/assets/logo-altm.png"
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, ChevronDown, ChevronRight } from "lucide-react"
import { HeaderSearchBar } from "@/components/search/HeaderSearchBar"
import { Button } from "@/components/ui/button";


export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const handleDropdownToggle = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index)
  }

  const handleLinkClick = () => {
    setOpenDropdown(null)
  }

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const contactSection = document.getElementById('contato')
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsOpen(false) // Fechar menu mobile se estiver aberto
  }
  
  const menu = [
    {
      name: "ACADEMIA",
      href: "#",
      subMenu:[
        {
          name: "HISTÓRICO",
          href: "/sobre-a-altm/historico"
        },
        {
          name: "ESTATUTO",
          href: "/sobre-a-altm/estatuto"
        },
        {
          name: "REGIMENTO",
          href: "/sobre-a-altm/regimento"
        },
        {
          name: "HISTÓRIA DO SITE",
          href: "/sobre-a-altm/historia-do-site"
        },
      ]
    },
    {
      name: "PROGRAMAÇÃO CULTURAL",
      href: "#",
      subMenu:[
        {
          name: "PROGRAMAÇÃO CULTURAL",
          href: "/programacao-cultural"
        },
        {
          name: "INSCRIÇÕES",
          href: "/inscricoes"
        },
        {
          name: "LANÇAMENTO DE LIVROS",
          href: "/lancamento-de-livros"
        },
        {
          name: "FEIRAS LITERÁRIAS",
          href: "/feiras-literarias"
        },
      ]
    },
    {
      name: "ACADÊMICOS ATUAIS",
      href: "/academicos-atuais"
    },
    {
      name: "MEMBROS",
      href: "/membros"
    },
    {
      name: "PRESIDENTES",
      href: "/presidentes"
    },
    {
      name: "DIRETORIA",
      href: "/diretoria"
    },
    {
      name: "ASSOCIADOS CORRESPONDENTES",
      href: "/socios-correspondentes"
    },
  ] 

  return (
    <>
      {/* HEADER DESKTOP */}
      <header className="hidden lg:block bg-[#ccc6b2] shadow-md border-b border-gray-200 relative z-50">
        {/* Barra superior com redes sociais */}
        <div className="bg-[#c3a855] py-2 h-14">
          <div className="max-w-[7xl] mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-end items-center h-full">
              
              <div className="flex-shrink-0 z-40 mx-10">
                <HeaderSearchBar 
                  placeholder="Buscar acadêmicos, artigos..." 
                  className="w-80"
                />
              </div>

              {/* BOTÃO DE FALE CONOSCO */}
              <div className="flex mr-10">
                <Link to={"/fale-conosco"}>
                  <Button className="cursor-pointer bg-white text-black hover:text-white transition">
                    FALE CONOSCO
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.instagram.com/academialetrastmuberaba?igsh=MXdhcGNnazRybG1udg==" 
                  className="text-white hover:text-gray-200 transition-all duration-200 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-8 w-8" />
                </a>
                <a 
                  href="#" 
                  className="text-white hover:text-gray-200 transition-all duration-200 hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Header principal com logo e navegação */}
        <div className="max-w-[1310px] mx-auto px-4 sm:px-6 lg:px-8 h-20 relative ">
          <div className="flex items-center justify-between h-full py-2">
            {/* Logo */}
            <div className="flex-shrink-0 -mb-5 z-50">
              <Link to="/" className="block">
                <img 
                  src={logo} 
                  alt="Logo Academia de letras do triangulo mineiro"
                />
              </Link>
            </div>

            {/* Navigation Menu - Centro */}
            <nav className="flex-1 flex justify-center z-40">
              <ul className="flex items-center space-x-4">
                {menu.map((item, index) => (
                  <li key={index} className="relative">
                    {item.subMenu ? (
                      <div className="relative group dropdown-container">
                        <button 
                          onClick={() => handleDropdownToggle(index)}
                          className={`px-5 py-3 rounded-lg transition-all duration-300 font-semibold text-sm flex items-center gap-2 relative overflow-hidden group ${
                            openDropdown === index
                              ? 'bg-gradient-to-r from-[#be9f3c] to-[#c1a44e] text-white shadow-lg'
                              : 'bg-transparent text-gray-800 hover:bg-gradient-to-br hover:from-[#be9f3c]/10 hover:to-[#c1a44e]/20 hover:text-[#be9f3c] hover:shadow-lg'
                          }`}
                        >
                          <span className="relative z-10">{item.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 relative z-10 ${
                            openDropdown === index ? 'rotate-180' : 'group-hover:rotate-180'
                          }`} />
                          
                          {/* Efeito de brilho no hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                        
                        {/* Dropdown elegante */}
                        <div className={`absolute top-full left-0 mt-3 w-[400px] md:w-[480px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 transition-all duration-300 transform origin-top ${
                          openDropdown === index 
                            ? 'opacity-100 visible scale-y-100 translate-y-0' 
                            : 'opacity-0 invisible scale-y-95 -translate-y-2'
                        }`}>                
                          {/* Conteúdo do dropdown */}
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.subMenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={subItem.href}
                                  onClick={handleLinkClick}
                                  className={`group relative block p-4 bg-gray-50 hover:bg-gradient-to-br hover:from-[#be9f3c]/10 hover:to-[#c1a44e]/10 rounded-lg border border-transparent hover:border-[#be9f3c]/30 transition-all duration-300 hover:shadow-md hover:scale-105 ${
                                    openDropdown === index 
                                      ? 'animate-in slide-in-from-top-2 fade-in duration-300' 
                                      : ''
                                  }`}
                                  style={{
                                    animationDelay: `${subIndex * 50}ms`
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#be9f3c] transition-colors duration-300">
                                        {subItem.name}
                                      </h4>
                                    </div>
                                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <ChevronRight className="h-4 w-4 text-[#be9f3c]" />
                                    </div>
                                  </div>
                                  
                                  {/* Linha decorativa */}
                                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#be9f3c] to-[#c1a44e] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                  
                                  {/* Indicador de hover */}
                                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#be9f3c] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      item.name === "Fale Conosco" ? (
                        <a 
                          href="/#contato" 
                          onClick={handleContactClick}
                          className="bg-transparent hover:shadow-lg active:shadow-lg px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm text-gray-800 border border-transparent hover:border-[#be9f3c] active:border-[#be9f3c] inline-flex items-center justify-center hover:bg-gradient-to-br hover:from-[#be9f3c]/10 hover:to-[#be9f3c]/20 active:bg-gradient-to-br active:from-[#be9f3c]/15 active:to-[#be9f3c]/25 hover:text-[#be9f3c] active:text-[#be9f3c]"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link 
                          to={item.href} 
                          className="bg-transparent hover:shadow-lg active:shadow-lg px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm text-gray-800 border border-transparent hover:border-[#be9f3c] active:border-[#be9f3c] inline-flex items-center justify-center hover:bg-gradient-to-br hover:from-[#be9f3c]/10 hover:to-[#be9f3c]/20 active:bg-gradient-to-br active:from-[#be9f3c]/15 active:to-[#be9f3c]/25 hover:text-[#be9f3c] active:text-[#be9f3c]"
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* SearchBar - Direita */}
          </div>
        </div>
      </header>

      {/* HEADER MOBILE */}
      <header className="lg:hidden bg-white shadow-md border-b border-gray-200 relative z-50">
        {/* Barra superior mobile com nome da academia */}
        <div className="bg-[#c3a855] py-3">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-white text-xs font-medium leading-tight">
                Academia de Letras do Triângulo Mineiro
              </h1>
            </div>
          </div>
        </div>

        {/* Header principal mobile */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo mobile - menor */}
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <img 
                  src={logo} 
                  alt="Logo Academia de letras do triangulo mineiro"
                  className="h-30 w-auto -mb-[65px]"
                />
              </Link>
            </div>

            {/* SearchBar mobile e Menu mobile */}
            <div className="flex items-center space-x-3">
              <div className="flex-1 max-w-xs">
                <HeaderSearchBar 
                  placeholder="Buscar..." 
                  className="w-full"
                />
              </div>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-[#be9f3c] hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-[#be9f3c]/30">
                    <Menu className="h-5 w-5" />
                    <span className="text-sm font-medium">Menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
                  <SheetHeader>
                    <SheetTitle className="text-left text-[#be9f3c] font-bold text-xl">
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6">
                    <div className="space-y-2">
                      {menu.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 pb-2">
                          {item.subMenu ? (
                            <div>
                              <button
                                onClick={() => setOpenSubmenu(openSubmenu === index ? null : index)}
                                className="flex items-center justify-between w-full py-3 px-4 text-left text-gray-800 hover:text-[#be9f3c] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                              >
                                <span>{item.name}</span>
                                {openSubmenu === index ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <div className={`overflow-hidden transition-all duration-300 ease-out ${
                                openSubmenu === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                              }`}>
                                <div className="mt-2 ml-4 space-y-1">
                                  {item.subMenu.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      to={subItem.href}
                                      onClick={() => setIsOpen(false)}
                                      className={`block py-2 px-4 text-sm text-gray-600 hover:text-[#be9f3c] hover:bg-gray-50 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                                        openSubmenu === index 
                                          ? 'opacity-100 translate-x-0' 
                                          : 'opacity-0 -translate-x-2'
                                      }`}
                                      style={{
                                        transitionDelay: openSubmenu === index ? `${subIndex * 100}ms` : '0ms'
                                      }}
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            item.name === "Fale Conosco" ? (
                              <a
                                href="/#contato"
                                onClick={handleContactClick}
                                className="block py-3 px-4 text-gray-800 hover:text-[#be9f3c] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                              >
                                {item.name}
                              </a>
                            ) : (
                              <Link
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-3 px-4 text-gray-800 hover:text-[#be9f3c] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                              >
                                {item.name}
                              </Link>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                    


                    {/* Redes sociais no menu mobilee */}
                    <div className="mt-8 pt-6 border-t border-gray-200 px-2">
                      <p className="text-sm text-gray-600 mb-6 font-medium px-2">Siga-nos</p>
                      <div className="flex justify-center space-x-6">
                        <a 
                          href="#" 
                          className="p-3 bg-[#be9f3c] text-white rounded-full hover:bg-[#be9f3c]/80 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                          aria-label="Instagram"
                        >
                          <FaInstagram className="h-5 w-5" />
                        </a>
                        <a 
                          href="#" 
                          className="p-3 bg-[#be9f3c] text-white rounded-full hover:bg-[#be9f3c]/80 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                          aria-label="Facebook"
                        >
                          <FaFacebook className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}