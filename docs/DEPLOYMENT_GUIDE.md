# Guia de Implantacao

## Requisitos

- Node.js 18 ou superior.
- npm.
- Projeto Supabase criado.
- Chave de API do Gemini.

## Variaveis de ambiente

### Frontend

Arquivo: `frontend/.env`

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
VITE_BACKEND_URL=http://localhost:3000
```

Em producao, `VITE_BACKEND_URL` deve apontar para a URL publica do backend.

### Backend

Arquivo: `backend/.env`

```env
GEMINI_API_KEY=sua-chave-gemini
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

## Instalacao local

Na raiz:

```bash
npm install
```

No frontend:

```bash
cd frontend
npm install
```

No backend:

```bash
cd backend
npm install
```

## Banco de dados e Supabase

1. Configure `profiles`, autenticacao e RLS seguindo `SUPABASE_SETUP.md`.
2. Execute no SQL Editor do Supabase:
   - `final_evaluations_migration.sql`
   - `add_question_role_name.sql`
   - `fix_supabase_public_permissions.sql`, se for necessario corrigir permissoes publicas.
3. Confira se as tabelas principais existem: `profiles`, `roles`, `questions`, `projects`, `evaluations` e `final_evaluations`.

## Rodando localmente

Pela raiz do projeto:

```bash
npm run dev
```

Ou em processos separados:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

URLs locais:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

## Build do frontend

```bash
cd frontend
npm run build
```

O resultado fica em `frontend/dist`.

## Publicacao

### Frontend

O frontend pode ser publicado na Vercel. O arquivo `frontend/vercel.json` ja redireciona rotas SPA para `index.html`.

Configuracoes recomendadas:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Variaveis: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BACKEND_URL`.

### Backend

O backend pode ser publicado em Render, Railway, Fly.io ou outro provedor Node.js.

Configuracoes recomendadas:

- Root directory: `backend`
- Install command: `npm install`
- Variaveis: `GEMINI_API_KEY`, `GEMINI_MODEL`, `PORT`.

Observacao: atualmente o backend possui script de desenvolvimento com `ts-node-dev`. Para producao, o ideal e adicionar scripts `build` e `start` compilando TypeScript para JavaScript.

## Checklist de validacao

- Login funciona com usuarios criados no Supabase Auth.
- O usuario e redirecionado conforme `profiles.role`.
- Admin consegue gerenciar cargos, perguntas e relatorios.
- Lideres conseguem registrar feedbacks recorrentes.
- A tela de avaliacao final lista colaboradores e periodos.
- O botao `Gerar Insights com IA` retorna sugestoes quando ha feedbacks no semestre.
- A avaliacao final pode ser salva como rascunho.
- A avaliacao final pode ser enviada para aprovacao.
- A publicacao so ocorre apos as aprovacoes necessarias.
- O colaborador visualiza apenas avaliacoes finais publicadas.
