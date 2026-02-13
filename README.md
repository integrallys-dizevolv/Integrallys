# Integrallys

Aplicação React.js construída com TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Vite** - Build tool e dev server
- **Supabase** - Backend as a Service (BaaS)

## 📦 Instalação

```bash
npm install
```

## 🔧 Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure suas variáveis de ambiente do Supabase no arquivo `.env`

## 🏃 Executar

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── hooks/         # Hooks customizados (incluindo hooks do Supabase)
├── lib/           # Bibliotecas e configurações (Supabase, etc)
├── types/         # Definições de tipos TypeScript
├── App.tsx        # Componente principal
├── main.tsx       # Ponto de entrada
└── index.css      # Estilos globais (Tailwind)
```

## 🎨 Regras de Desenvolvimento

- ✅ Componentes Funcionais com TypeScript
- ✅ Composição de componentes
- ✅ Tailwind CSS (mobile-first)
- ✅ Lógica do Supabase isolada em Hooks customizados
- ✅ Nomes de classes e variáveis fiéis aos tokens do Figma
