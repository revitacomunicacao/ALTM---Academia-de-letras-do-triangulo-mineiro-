# Template Web Revita - Site Institucional

Um template moderno e otimizado para desenvolvimento rápido de sites institucionais, construído com React, TypeScript e Vite.

> **🚀 Comece rapidamente:** `npx create-web-revita`

## 🚀 Características

- ⚡ **Vite** - Build tool ultra-rápido
- ⚛️ **React 19** - Framework moderno com Hooks
- 📝 **TypeScript** - Tipagem estática para melhor desenvolvimento
- 🛣️ **React Router DOM** - Roteamento client-side
- 📄 **File-based Routing** - Roteamento baseado em arquivos (estilo Next.js)
- 🔍 **SEO Otimizado** - Hook personalizado para meta tags
- 📱 **Responsivo** - Layout adaptável para todos os dispositivos
- 🧹 **ESLint** - Linting configurado para qualidade de código

## 📦 Instalação

```bash
# Crie um novo projeto usando o template
npx create-web-revita

# Siga as instruções no terminal
# O template será baixado e configurado automaticamente

# Entre no diretório criado
cd seu-projeto

#Baixe as dependencias
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── index.tsx          # Página inicial
│   ├── about/
│   │   └── index.tsx      # Página "Sobre Nós"
│   └── produtos/
│       └── [slug]/
│           └── index.tsx  # Página dinâmica de produtos
├── hooks/
│   └── useSeo.ts          # Hook para SEO
├── main.tsx               # Ponto de entrada
└── index.css              # Estilos globais
```

## 🎯 Como Usar

### 1. Páginas Estáticas

Crie páginas simples adicionando arquivos `index.tsx` em pastas dentro de `src/app/`:

```tsx
// src/app/contato/index.tsx
import useSeo from "@/hooks/useSeo"

export default function ContactPage() {
  useSeo({
    title: "Contato",
    description: "Entre em contato conosco",
    image: "/og-image.jpg"
  })
  
  return (
    <main>
      <h1>Contato</h1>
      <p>Formulário de contato aqui...</p>
    </main>
  )
}
```

### 2. Páginas Dinâmicas

Para páginas com parâmetros dinâmicos, use colchetes no nome da pasta:

```tsx
// src/app/blog/[id]/index.tsx
import useSeo from "@/hooks/useSeo"
import { useParams } from 'react-router-dom'

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  
  useSeo({
    title: `Post ${id}`,
    description: `Leia o post ${id}`,
    image: "/blog-image.jpg"
  })
  
  return (
    <main>
      <h1>Post {id}</h1>
      <p>Conteúdo do post...</p>
    </main>
  )
}
```

### 3. SEO Otimizado

Use o hook `useSeo` em todas as páginas para configurar meta tags:

```tsx
useSeo({
  title: "Título da Página",
  description: "Descrição para SEO",
  image: "https://exemplo.com/og-image.jpg",
  icon: "https://exemplo.com/favicon.ico",
  "og:type": "website",
  "twitter:card": "summary_large_image"
})
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção

# Preview
npm run preview      # Visualiza build de produção

# Linting
npm run lint         # Executa ESLint
```

## 🎨 Personalização

### 1. Estilos Globais

Edite `src/index.css` para personalizar estilos globais:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-family: 'Arial', sans-serif;
}

body {
  font-family: var(--font-family);
  margin: 0;
  padding: 0;
}
```

### 2. Configuração do Vite

Modifique `vite.config.ts` para adicionar plugins ou configurar aliases:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [react(), Pages()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
})
```

## 📱 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure o build command: `npm run build`
3. Configure o output directory: `dist`
4. Deploy automático a cada push

### Netlify

1. Conecte seu repositório ao Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`

### GitHub Pages

```bash
# Adicione o script de deploy no package.json
"deploy": "npm run build && gh-pages -d dist"

# Instale gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

## 🔧 Tecnologias

- **React 19** - Framework JavaScript
- **TypeScript** - Superset JavaScript com tipagem
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **vite-plugin-pages** - File-based routing
- **ESLint** - Linting de código

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) antes de submeter um pull request.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/seu-usuario/template-web-revita/issues) no GitHub ou entre em contato através do npm.

## 📦 Publicado no NPM

Este template está disponível no NPM como `create-web-revita`. Para usar, simplesmente execute:

```bash
npx create-web-revita
```

---

**Desenvolvido com ❤️ para facilitar o desenvolvimento de sites institucionais**
