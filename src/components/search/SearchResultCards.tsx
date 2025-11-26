import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  FaUser, 
  FaGraduationCap, 
  FaFileAlt, 
  FaBlog, 
  FaCrown, 
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronRight
} from "react-icons/fa";
import type { SearchResult } from "@/types/ISearch";

interface SearchResultCardProps {
  result: SearchResult;
  onClick?: () => void;
}

// Card para Membros
export function MembroCard({ result, onClick }: SearchResultCardProps) {
  const href = `/academicos/membros/${result.id}`;
  
  return (
    <Link to={href} onClick={onClick}>
      <div className="search-card group flex items-center justify-between px-4 py-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-l-altm-gold-500 min-h-[72px] w-full">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {result.foto ? (
              <img 
                src={result.foto} 
                alt={result.title}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-altm-gold-100 rounded-full flex items-center justify-center">
                <FaGraduationCap className="text-altm-gold-600 text-base" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-altm-gold-700 bg-altm-gold-50 px-2 py-0.5 rounded-full flex-shrink-0">Acadêmico</span>
              {result.cadeira && (
                <span className="text-xs text-gray-500 truncate">Cadeira {result.cadeira}</span>
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 group-hover:text-altm-gold-700 transition-colors text-sm truncate">
              {result.title}
            </h3>
          </div>
        </div>
        
        <FaChevronRight className="text-gray-400 group-hover:text-altm-gold-500 text-xs flex-shrink-0" />
      </div>
    </Link>
  );
}

// Card para Artigos
export function ArtigoCard({ result, onClick }: SearchResultCardProps) {
  const href = `/artigos/${result.id}`;
  
  return (
    <Link to={href} onClick={onClick}>
      <div className="search-card group flex items-center justify-between px-4 py-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-l-blue-500 min-h-[72px] w-full">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="text-blue-600 text-base" />
            </div>
          </div>
          
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">Artigo</span>
              {result.academico && (
                <span className="text-xs text-gray-500 truncate">{result.academico.nome}</span>
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors text-sm truncate">
              {result.title}
            </h3>
          </div>
        </div>
        
        <FaChevronRight className="text-gray-400 group-hover:text-blue-500 text-xs flex-shrink-0" />
      </div>
    </Link>
  );
}

// Card para Blog
export function BlogCard({ result, onClick }: SearchResultCardProps) {
  const href = `/blog/${result.id}`;
  
  return (
    <Link to={href} onClick={onClick}>
      <div className="search-card group flex items-center justify-between px-4 py-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-l-green-500 min-h-[72px] w-full">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {result.imagem_destacada ? (
              <img 
                src={result.imagem_destacada} 
                alt={result.title}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaBlog className="text-green-600 text-base" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">Notícias</span>
            </div>
            
            <h3 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors text-sm truncate">
              {result.title}
            </h3>
          </div>
        </div>
        
        <FaChevronRight className="text-gray-400 group-hover:text-green-500 text-xs flex-shrink-0" />
      </div>
    </Link>
  );
}

// Card para Sócios Correspondentes
export function SocioCorrespondenteCard({ result, onClick }: SearchResultCardProps) {
  const href = `/academicos/socios-correspondentes`;
  
  return (
    <Link to={href} onClick={onClick}>
      <div className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-l-orange-500">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {result.foto ? (
              <img 
                src={result.foto} 
                alt={result.title}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FaUser className="text-orange-600 text-sm" />
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-orange-700">Sócio Correspondente</span>
            </div>
            
            <h3 className="font-medium text-gray-900 group-hover:text-orange-700 transition-colors truncate">
              {result.title}
            </h3>
          </div>
        </div>
        
        <FaChevronRight className="text-gray-400 group-hover:text-orange-500 text-xs flex-shrink-0" />
      </div>
    </Link>
  );
}

// Componente principal que escolhe o card adequado
export function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  switch (result.type) {
    case 'membro':
      return <MembroCard result={result} onClick={onClick} />;
    case 'artigo':
      return <ArtigoCard result={result} onClick={onClick} />;
    case 'blog':
      return <BlogCard result={result} onClick={onClick} />;
    case 'socio-correspondente':
      return <SocioCorrespondenteCard result={result} onClick={onClick} />;
    default:
      return null;
  }
}
