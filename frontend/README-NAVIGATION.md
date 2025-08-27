# Estrutura de Navegação - Portal Educa

## Visão Geral

Este documento descreve a estrutura de navegação implementada no Portal Educa, incluindo a navbar, breadcrumbs e organização das páginas.

## Componentes de Navegação

### 1. Navbar (`components/navbar.tsx`)

A navbar principal da aplicação que inclui:

- **Logo e Nome**: Portal Educa com ícone 🎓
- **Menu de Navegação**: Links para todas as páginas principais
- **Indicador de Página Ativa**: Destaque visual para a página atual
- **Botão de Logout**: Funcionalidade para sair da aplicação
- **Menu Mobile**: Versão responsiva com hamburger menu

#### Páginas Navegáveis:
- 📊 Dashboard (`/dashboard`)
- 👨‍🎓 Alunos (`/alunos`)
- 📚 Cursos (`/cursos`)
- 👨‍🏫 Professores (`/professores`)

### 2. Breadcrumb (`components/breadcrumb.tsx`)

Componente de navegação hierárquica que mostra:

- **Dashboard** como ponto de partida
- **Página Atual** destacada
- **Navegação Rápida** para voltar às páginas anteriores

### 3. Layouts

#### Layout Principal (`app/layout.tsx`)
- Layout base da aplicação
- Inclui fontes, metadata e ErrorBoundary
- **NÃO** inclui navbar (gerenciado pelos layouts específicos)

#### Layout Autenticado (`app/(auth)/layout.tsx`)
- Layout para páginas que requerem autenticação
- Inclui navbar e breadcrumb
- Aplica-se a todas as páginas dentro da pasta `(auth)`

#### Layout de Login (`app/login/page.tsx`)
- Página de login sem navbar
- Design limpo e focado

## Estrutura de Pastas

```
app/
├── layout.tsx                 # Layout principal (sem navbar)
├── page.tsx                   # Página home (redireciona para dashboard)
├── login/                     # Página de login (sem navbar)
│   └── page.tsx
├── (auth)/                    # Grupo de páginas autenticadas
│   ├── layout.tsx            # Layout com navbar e breadcrumb
│   ├── dashboard/            # Dashboard principal
│   │   └── page.tsx
│   ├── alunos/               # Gestão de alunos
│   │   └── page.tsx
│   ├── cursos/               # Gestão de cursos
│   │   └── page.tsx
│   └── professores/          # Gestão de professores
│       └── page.tsx
└── globals.css               # Estilos globais
```

## Características da Implementação

### Responsividade
- Menu mobile com hamburger
- Adaptação automática para diferentes tamanhos de tela
- Ícones e textos otimizados para mobile

### Acessibilidade
- Labels semânticos para leitores de tela
- Navegação por teclado
- Contraste adequado de cores

### Performance
- Componentes otimizados com React hooks
- Navegação client-side com Next.js
- Lazy loading de componentes quando necessário

### Estado e Navegação
- Indicador visual da página ativa
- Breadcrumbs dinâmicos baseados na rota
- Funcionalidade de logout integrada

## Uso

### Importação dos Componentes

```typescript
// Importação individual
import { Navbar } from '@/components/navbar'
import { Breadcrumb } from '@/components/breadcrumb'

// Importação em lote
import { Navbar, Breadcrumb } from '@/components'
```

### Adicionando Novas Páginas

Para adicionar uma nova página que deve ter a navbar:

1. Crie a pasta dentro de `app/(auth)/`
2. Adicione o item ao array `navigationItems` em `navbar.tsx`
3. Adicione o mapeamento no `pathMap` do `breadcrumb.tsx`

### Personalização

- **Cores**: Modifique as classes Tailwind CSS nos componentes
- **Ícones**: Substitua os emojis por ícones SVG ou de bibliotecas
- **Logos**: Atualize o logo e nome da aplicação na navbar
- **Funcionalidades**: Adicione novos botões ou funcionalidades conforme necessário

## Tecnologias Utilizadas

- **Next.js 14**: App Router e layouts aninhados
- **React**: Hooks e componentes funcionais
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **Shadcn UI**: Componentes base (Button)
- **Radix UI**: Primitivos de acessibilidade
