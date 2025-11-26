// Export all search components
export { SearchBar } from './SearchBar';
export { SearchResultCard } from './SearchResultCards';
export { 
  MembroCard, 
  ArtigoCard, 
  BlogCard, 

  SocioCorrespondenteCard 
} from './SearchResultCards';

// Search configuration
export const SEARCH_COLORS = {
  membro: {
    primary: 'altm-gold-500',
    light: 'altm-gold-100',
    dark: 'altm-gold-600',
    bg: 'altm-gold-50',
    text: 'altm-gold-700'
  },
  artigo: {
    primary: 'blue-500',
    light: 'blue-100', 
    dark: 'blue-600',
    bg: 'blue-50',
    text: 'blue-700'
  },
  blog: {
    primary: 'green-500',
    light: 'green-100',
    dark: 'green-600', 
    bg: 'green-50',
    text: 'green-700'
  },
  presidente: {
    primary: 'purple-500',
    light: 'purple-100',
    dark: 'purple-600',
    bg: 'purple-50', 
    text: 'purple-700'
  },
  diretoria: {
    primary: 'indigo-500',
    light: 'indigo-100',
    dark: 'indigo-600',
    bg: 'indigo-50',
    text: 'indigo-700'
  },
  'socio-correspondente': {
    primary: 'orange-500',
    light: 'orange-100',
    dark: 'orange-600',
    bg: 'orange-50',
    text: 'orange-700'
  }
} as const;

export const SEARCH_ICONS = {
  membro: '👨‍🎓',
  artigo: '📄',
  blog: '📝', 
  presidente: '👑',
  diretoria: '👥',
  'socio-correspondente': '🤝'
} as const;

export const SEARCH_LABELS = {
  membro: 'Acadêmico',
  artigo: 'Artigo', 
  blog: 'Notícias',
  presidente: 'Presidente',
  diretoria: 'Diretoria',
  'socio-correspondente': 'Sócio Correspondente'
} as const;
