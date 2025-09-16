import banner from "@/assets/banner-internas.jpg"
import banner2 from "@/assets/background.jpg"
import banner3 from "@/assets/background-2.jpg"

import { ReactNode } from "react"
import { FaBookOpen, FaGraduationCap, FaUsers, FaNewspaper, FaInfoCircle, FaCrown, FaHandshake } from "react-icons/fa"

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  breadcrumb?: Array<{ label: string; href?: string }>
}

const getIconForPage = (path: string) => {
  if (path.includes('academicos')) return <FaGraduationCap className="w-6 h-6" />
  if (path.includes('artigos')) return <FaBookOpen className="w-6 h-6" />
  if (path.includes('blog')) return <FaNewspaper className="w-6 h-6" />
  if (path.includes('sobre-a-altm')) return <FaInfoCircle className="w-6 h-6" />
  return <FaBookOpen className="w-6 h-6" />
}

export const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  breadcrumb 
}: PageHeaderProps) => {
  return (
    <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${banner2})` }}>
      {/* Overlay para melhorar a legibilidade */}
      <div className="absolute inset-0 bg-[#30270c]/90"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 text-sm text-white/80">
              {breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {item.href ? (
                    <a 
                      href={item.href} 
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-white font-medium">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}

        {/* Header Content - Centralizado */}
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-5 bg-[#f1d4755b] rounded-xl flex items-center justify-center text-white shadow-lg">
              {icon || <FaBookOpen />}
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Decorative Element */}
          <div className="mt-8 flex justify-center items-center space-x-2">
            <div className="h-1 w-16 bg-gradient-to-r from-altm-gold-400 to-altm-gold-600 rounded-full"></div>
            <div className="h-1 w-8 bg-altm-gold-300 rounded-full"></div>
            <div className="h-1 w-4 bg-altm-gold-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}