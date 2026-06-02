# Guia de Implantação — Feedback Project

Este guia detalha todos os passos necessários para configurar, rodar localmente e publicar o sistema de feedbacks. Ele foi escrito para que qualquer pessoa consiga seguir, mesmo sem experiência prévia com desenvolvimento.

---

## 1. Pré-requisitos — O que instalar antes

### 1.1 Node.js e npm

O projeto precisa do Node.js (versão 18 ou superior) para funcionar. O npm (gerenciador de pacotes) já vem incluso.

1. Acesse https://nodejs.org
2. Baixe a versão **LTS** (recomendada).
3. Execute o instalador e siga os passos padrão (pode clicar "Next" em tudo).
4. Após instalar, abra um terminal (PowerShell ou CMD) e verifique:

```bash
node --version
npm --version
```

Se ambos mostrarem um número de versão, a instalação foi bem-sucedida.

### 1.2 Git (opcional, mas recomendado)

Para clonar o repositório do projeto:

1. Acesse https://git-scm.com/downloads
2. Baixe e instale.
3. Verifique no terminal:

```bash
git --version
```

### 1.3 Obter o código do projeto

Se o projeto está em um repositório Git:

```bash
git clone <URL-DO-REPOSITORIO>
cd feedback-project
```

Se você recebeu o código como arquivo ZIP, extraia-o e abra a pasta no terminal.

---

## 2. Configurar o Supabase (Banco de Dados)

O Supabase é o banco de dados e sistema de autenticação do projeto. Ele é gratuito para projetos pequenos.

### 2.1 Criar conta e projeto

1. Acesse https://supabase.com e crie uma conta (pode usar login com GitHub).
2. No dashboard, clique em **New project**.
3. Preencha nome do projeto, senha do banco e região.
4. Aguarde o projeto ser criado (pode levar 1-2 minutos).

### 2.2 Obter as chaves do projeto

1. No painel do Supabase, vá em **Project Settings** > **API**.
2. Copie:
   - **Project URL** → será o `VITE_SUPABASE_URL`
   - **anon public key** → será o `VITE_SUPABASE_ANON_KEY`

### 2.3 Criar as tabelas

1. No Supabase, abra **SQL Editor** (menu lateral esquerdo).
2. Clique em **New query**.
3. Siga as instruções do arquivo `SUPABASE_SETUP.md` (na raiz do projeto) para criar a tabela `profiles` e configurar as políticas de segurança (RLS).
4. Após isso, execute os seguintes arquivos SQL **nesta ordem** (copie o conteúdo de cada arquivo e cole no SQL Editor):
   - `final_evaluations_migration.sql`
   - `add_question_role_name.sql`
   - `fix_supabase_public_permissions.sql` (somente se houver erros de permissão)

**Validação:** No menu lateral do Supabase, abra **Table Editor**. Você deve ver as tabelas: `profiles`, `roles`, `questions`, `projects`, `evaluations` e `final_evaluations`.

### 2.4 Criar o primeiro usuário (admin)

1. No Supabase, vá em **Authentication** > **Users**.
2. Clique em **Add user** > **Create new user**.
3. Informe e-mail e senha (ex: `admin@empresa.com` / `senha123`).
4. Copie o **User UID** gerado.
5. No **SQL Editor**, insira o perfil desse usuário:

```sql
INSERT INTO public.profiles (id, name, email, role)
VALUES (
  'COLE-O-USER-UID-AQUI',
  'Administrador',
  'admin@empresa.com',
  'admin'
);
```

Repita o processo para criar líderes e colaboradores, alterando o `role` para: `technical-leader`, `behavioral-leader` ou `employee`.

---

## 3. Obter a chave da API Gemini (Inteligência Artificial)

A IA é usada para gerar insights nas avaliações finais dos colaboradores.

1. Acesse https://aistudio.google.com/apikey
2. Faça login com sua conta Google.
3. Clique em **Create API Key**.
4. Selecione um projeto do Google Cloud (ou crie um novo).
5. Copie a chave gerada → será o `GEMINI_API_KEY`.

**Nota sobre custo:** Para uma empresa de 51-200 funcionários com avaliações anuais, o custo estimado é inferior a $7/ano (praticamente gratuito). O tier gratuito do Google já cobre esse volume.

---

## 4. Configurar variáveis de ambiente

### 4.1 Frontend

Crie o arquivo `frontend/.env` com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
VITE_BACKEND_URL=http://localhost:3000
```

Substitua pelos valores reais obtidos no passo 2.2.

> Em produção, `VITE_BACKEND_URL` deve apontar para a URL pública do backend (ex: `https://seu-backend.onrender.com`).

### 4.2 Backend

Crie o arquivo `backend/.env` com o seguinte conteúdo:

```env
GEMINI_API_KEY=sua-chave-gemini
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Substitua `sua-chave-gemini` pela chave obtida no passo 3.

---

## 5. Instalação das dependências

Abra um terminal na pasta raiz do projeto e execute os comandos abaixo **na ordem**:

```bash
npm install
```

```bash
cd frontend
npm install
cd ..
```

```bash
cd backend
npm install
cd ..
```

**Validação:** Se não apareceram erros vermelhos, as dependências foram instaladas corretamente. Avisos amarelos ("warn") podem ser ignorados.

---

## 6. Rodar o projeto localmente

### Opção A — Comando único (recomendado)

Na raiz do projeto:

```bash
npm run dev
```

Isso inicia o frontend e o backend simultaneamente.

### Opção B — Terminais separados

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

### URLs locais

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health check | http://localhost:3000/health |

### Validação

1. Abra http://localhost:3000/health no navegador. Deve mostrar: `{"status":"ok"}`
2. Abra http://localhost:5173 no navegador. Deve aparecer a tela de login.
3. Faça login com o usuário admin criado no passo 2.4. Você deve ser redirecionado para o painel administrativo.

---

## 7. Publicação em produção

### 7.1 Frontend na Vercel (gratuito)

A Vercel é a plataforma recomendada para hospedar o frontend.

1. Acesse https://vercel.com e crie uma conta (login com GitHub é mais prático).
2. Clique em **Add New** > **Project**.
3. Importe o repositório do projeto (conecte seu GitHub se necessário).
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` → sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` → sua anon key
   - `VITE_BACKEND_URL` → a URL pública do backend (ex: `https://seu-app.onrender.com`)
6. Clique em **Deploy**.

**Validação:** Após o deploy, a Vercel mostra uma URL (ex: `https://seu-app.vercel.app`). Abra-a e verifique se a tela de login aparece.

> O arquivo `frontend/vercel.json` já está configurado para redirecionar todas as rotas para `index.html` (necessário para SPAs com React Router).

### 7.2 Backend no Render (gratuito)

O Render é recomendado por ser simples e ter plano gratuito.

1. Acesse https://render.com e crie uma conta.
2. Clique em **New** > **Web Service**.
3. Conecte o repositório do projeto.
4. Configure:
   - **Name:** `feedback-backend` (ou o nome que preferir)
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Em **Environment Variables**, adicione:
   - `GEMINI_API_KEY` → sua chave Gemini
   - `GEMINI_MODEL` → `gemini-2.5-flash`
   - `PORT` → `3000`
6. Clique em **Create Web Service**.

**Validação:** Após o deploy, acesse `https://sua-url.onrender.com/health`. Deve retornar `{"status":"ok"}`.

> **Importante:** Após obter a URL do backend no Render, volte à Vercel e atualize a variável `VITE_BACKEND_URL` com essa URL. Faça um redeploy no frontend.

### 7.3 Scripts de produção do backend

O backend precisa dos scripts `build` e `start` no `backend/package.json` para funcionar em produção. Se ainda não existem, adicione na seção `"scripts"`:

```json
{
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

- `build` compila o TypeScript para JavaScript na pasta `dist/`.
- `start` executa o código compilado (usado em produção).

---

## 8. Configuração de CORS para produção

O backend atual aceita requisições de qualquer origem (`cors()` sem opções). Para produção, é recomendado restringir ao domínio do frontend.

No arquivo `backend/src/app.ts`, altere:

```typescript
app.use(cors());
```

Para:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
```

E adicione no `backend/.env` de produção:

```env
FRONTEND_URL=https://seu-app.vercel.app
```

---

## 9. Checklist de validação final

Após a publicação, verifique cada item:

- [ ] http://sua-url/health retorna `{"status":"ok"}`
- [ ] Login funciona com usuários criados no Supabase Auth
- [ ] O usuário é redirecionado conforme `profiles.role`
- [ ] Admin consegue gerenciar cargos, perguntas e relatórios
- [ ] Líderes conseguem registrar feedbacks recorrentes
- [ ] A tela de avaliação final lista colaboradores e períodos
- [ ] O botão "Gerar Insights com IA" retorna sugestões quando há feedbacks
- [ ] A avaliação final pode ser salva como rascunho
- [ ] A avaliação final pode ser enviada para aprovação
- [ ] A publicação só ocorre após as aprovações necessárias
- [ ] O colaborador visualiza apenas avaliações finais publicadas

---

## 10. Solução de problemas comuns

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `npm run dev` falha com "concurrently not found" | Dependências da raiz não instaladas | Execute `npm install` na raiz do projeto |
| Tela branca no frontend | Variáveis VITE_ não configuradas | Verifique se `frontend/.env` existe e reinicie o dev server |
| Erro 401 no login | Usuário não criado no Supabase Auth | Crie o usuário em Authentication > Users |
| Login funciona mas redireciona para 404 | Perfil não inserido na tabela `profiles` | Insira o registro com o role correto (passo 2.4) |
| "GEMINI_API_KEY não configurada" | Arquivo `backend/.env` ausente ou incorreto | Verifique se `backend/.env` existe com a chave correta |
| Erro de CORS no navegador | Backend não permite a origem do frontend | Configure a variável `FRONTEND_URL` (passo 8) |
| Build do backend falha | TypeScript não compila | Execute `cd backend && npx tsc` para ver os erros detalhados |
