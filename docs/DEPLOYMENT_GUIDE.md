# Guia de Implantação — Feedback Project

Este guia detalha todos os passos necessários para configurar, rodar localmente e publicar o sistema de feedbacks. Ele foi escrito para que qualquer pessoa consiga seguir, mesmo sem experiência prévia com desenvolvimento.

---

## Glossário rápido

Antes de começar, entenda alguns termos que aparecem neste guia:

| Termo | O que significa |
|-------|----------------|
| **Terminal** | Programa onde você digita comandos de texto. No Windows, pode ser o PowerShell ou o Prompt de Comando (CMD). |
| **Variável de ambiente** | Configuração salva em um arquivo (`.env`) que o programa lê ao iniciar. Funciona como um "ajuste" que você define sem alterar o código. |
| **Dependência** | Biblioteca ou pacote que o projeto precisa para funcionar. São baixados automaticamente pelo `npm install`. |
| **Build** | Processo de transformar o código-fonte em uma versão otimizada para produção (publicação). |
| **Repositório** | Pasta do projeto versionada com Git. Contém todo o histórico de alterações. |

---

## Como abrir o terminal no Windows

Você precisará do terminal em vários passos deste guia. Para abri-lo:

1. Pressione as teclas **Windows + R** ao mesmo tempo.
2. Digite `powershell` e pressione **Enter**.
3. Uma janela azul/preta aparecerá — esse é o terminal.

**Alternativa:** Clique no botão Iniciar, digite "PowerShell" na busca e clique no resultado.

> **Dica:** Se você usa o VS Code (editor de código recomendado), pode abrir o terminal integrado com o atalho **Ctrl + `** (crase).

---

## 1. Pré-requisitos — O que instalar antes

### 1.1 Node.js e npm

O projeto precisa do Node.js (versão 18 ou superior) para funcionar. O npm (gerenciador de pacotes) já vem incluso.

1. Acesse https://nodejs.org
2. Baixe a versão **LTS** (recomendada).
3. Execute o instalador e siga os passos padrão (pode clicar "Next" em tudo).
4. Após instalar, abra o terminal (veja a seção "Como abrir o terminal no Windows" acima) e digite os comandos abaixo, pressionando **Enter** após cada um:

```bash
node --version
npm --version
```

Se ambos mostrarem um número de versão (ex: `v18.17.0` e `9.6.7`), a instalação foi bem-sucedida.

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

> **O que é `cd`?** O comando `cd` ("change directory") serve para entrar em uma pasta pelo terminal. Exemplo: `cd feedback-project` entra na pasta chamada "feedback-project". Para voltar uma pasta acima, use `cd ..`

Se você recebeu o código como arquivo ZIP, extraia-o e abra a pasta no terminal. Para isso:
1. Extraia o ZIP (clique com botão direito > "Extrair aqui").
2. No terminal, navegue até a pasta extraída: `cd C:\caminho\para\feedback-project`

---

## 2. Configurar o Supabase (Banco de Dados)

O Supabase é o banco de dados e sistema de autenticação do projeto. Ele é gratuito para projetos pequenos.

### 2.1 Criar conta e projeto

1. Acesse https://supabase.com e crie uma conta (pode usar login com GitHub).
2. No dashboard, clique em **New project**.
3. Preencha nome do projeto, senha do banco e região.
4. Aguarde o projeto ser criado (pode levar 1-2 minutos).

### 2.2 Obter as chaves do projeto

1. No painel do Supabase, vá em **Project Overview**.
2. Abaixo do nome do projeto terá a URL, clique em **copy** :
   - **Project URL** → será o `VITE_SUPABASE_URL`

1. No painel do Supabase, vá em **Project Settings** > **API Keys** > Aba **Legacy anon, service_role API keys**.
2. Copie:
   - **anon public** → será o `VITE_SUPABASE_ANON_KEY`

### 2.3 Criar as tabelas e popular com dados

O projeto possui **dois scripts SQL** na raiz do projeto. Execute-os **nesta ordem**:

#### Script 1: Estrutura do banco (`setup_database.sql`)

1. No Supabase, abra **SQL Editor** (menu lateral esquerdo).
2. Clique em **New query**.
3. Abra o arquivo `setup_database.sql` (está na pasta principal do projeto) em um editor de texto.
4. Copie **todo** o conteúdo do arquivo e cole no SQL Editor do Supabase.
5. Clique no botão verde **Run**.
6. Se aparecer "Success. No rows returned", todas as tabelas foram criadas!

**Validação:** No menu lateral do Supabase, abra **Table Editor**. Você deve ver as tabelas: `profiles`, `roles`, `questions`, `projects`, `project_members`, `evaluations` e `final_evaluations`.

#### Script 2: Dados de demonstração (`seed_demo_data.sql`)

1. No SQL Editor, clique em **New query** (uma nova query, não a mesma).
2. Abra o arquivo `seed_demo_data.sql` (também na raiz do projeto).
3. Copie **todo** o conteúdo e cole no SQL Editor.
4. Clique em **Run**.

Esse script cria **automaticamente** todos os usuários de teste, cargos, projetos e vínculos. **Você NÃO precisa criar usuários manualmente na aba Authentication > Users do Supabase** — o script já faz isso via SQL (insere em `auth.users` e `auth.identities` diretamente).

Após executar, os seguintes usuários estarão disponíveis para login:

| Usuário | E-mail | Senha | Cargo |
|---------|--------|-------|-------|
| Administrador | admin@empresa.com | Empresa@2026 | admin |
| Líder Técnico | tech@empresa.com | Empresa@2026 | technical-leader |
| Líder Comportamental | rh@empresa.com | Empresa@2026 | behavioral-leader |
| Colaborador | colaborador@empresa.com | Empresa@2026 | employee |
| Ana Silva | ana.silva@empresa.com | Empresa@2026 | employee |
| Carlos Mendes | carlos.mendes@empresa.com | Empresa@2026 | employee |
| Julia Costa | julia.costa@empresa.com | Empresa@2026 | employee |
| Pedro Alves | pedro.alves@empresa.com | Empresa@2026 | employee |
| Mariana Lima | mariana.lima@empresa.com | Empresa@2026 | employee |
| Roberto Santos | roberto.santos@empresa.com | Empresa@2026 | employee |
| Lucia Ferreira | lucia.ferreira@empresa.com | Empresa@2026 | employee |

**Validação:** Em **Authentication > Users**, devem aparecer os 11 usuários criados.

> **Para explicações detalhadas** de cada parte do SQL, consulte [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

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

O projeto já inclui um arquivo de exemplo em `frontend/.env.example`. Você precisa criar uma cópia chamada `.env` com seus valores reais.

**Como criar o arquivo `.env`:**

1. Abra o VS Code (ou outro editor de texto — **não** use o Word).
2. Vá em **Arquivo** > **Abrir Pasta** e abra a pasta `frontend`.
3. Crie um novo arquivo: **Arquivo** > **Novo Arquivo**.
4. Cole o conteúdo abaixo.
5. Salve como `.env` (Arquivo > Salvar Como, e digite exatamente `.env` como nome).

> **Importante:** O nome do arquivo é literalmente `.env` (começa com ponto e não tem extensão como `.txt`). Se o Windows adicionar `.txt` automaticamente, renomeie o arquivo pelo terminal: `ren .env.txt .env`

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
VITE_BACKEND_URL=http://localhost:3000
```

Substitua pelos valores reais obtidos no passo 2.2.

> Em produção, `VITE_BACKEND_URL` deve apontar para a URL pública do backend (ex: `https://seu-backend.onrender.com`).

### 4.2 Backend

Repita o processo acima para criar o arquivo `backend/.env` (dentro da pasta `backend`).

O projeto também inclui `backend/.env.example` como referência. Crie o `.env` com o seguinte conteúdo:

```env
GEMINI_API_KEY=sua-chave-gemini
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Substitua `sua-chave-gemini` pela chave obtida no passo 3.

---

## 5. Instalação das dependências

Abra um terminal na **pasta raiz** do projeto (a pasta principal chamada `feedback-project`, não as subpastas `frontend` ou `backend`). Para confirmar que você está no lugar certo, digite `dir` e verifique se aparecem as pastas `frontend` e `backend`.

Execute os comandos abaixo **na ordem**, pressionando Enter após cada um e aguardando a conclusão antes de digitar o próximo:

```bash
npm install
```

```bash
cd frontend
npm install
cd ..
```

> **Lembrete:** `cd frontend` entra na pasta frontend. `cd ..` volta para a pasta anterior (raiz).

```bash
cd backend
npm install
cd ..
```

**Validação:** Se não apareceram erros vermelhos, as dependências foram instaladas corretamente. Avisos amarelos ("warn") podem ser ignorados com segurança.

---

## 6. Rodar o projeto localmente

### Opção A — Comando único (recomendado)

Certifique-se de que o terminal está na **pasta raiz** do projeto (onde estão as pastas `frontend` e `backend`). Se você seguiu o passo 5, já deve estar lá. Caso contrário, navegue até ela com `cd C:\caminho\para\feedback-project`.

```bash
npm run dev
```

Isso inicia o frontend e o backend simultaneamente. Você verá várias mensagens no terminal — isso é normal.

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
3. Faça login com o usuário admin (`admin@empresa.com` / `Empresa@2026`). Você deve ser redirecionado para o painel administrativo.

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

O backend atual aceita requisições de qualquer origem (`cors()` sem opções). Para produção, é recomendado restringir ao domínio do frontend. Isso impede que sites desconhecidos acessem seu backend.

No arquivo `backend/src/app.ts`, altere a linha:

```typescript
app.use(cors());
```

Para:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
```

**Como fazer essa alteração:**
1. Abra o arquivo `backend/src/app.ts` no VS Code (ou outro editor de código).
2. Use **Ctrl + H** (Localizar e Substituir).
3. No campo "Localizar", cole: `app.use(cors());`
4. No campo "Substituir", cole: `app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));`
5. Clique em "Substituir" e salve o arquivo (**Ctrl + S**).

E adicione no `backend/.env` de produção (a mesma que você criou no passo 4.2, mas agora com a linha extra):

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
| Erro 401 no login | Script `seed_demo_data.sql` não foi executado | Execute o script no SQL Editor (passo 2.3). Ele cria os usuários automaticamente — não é necessário criar manualmente em Authentication > Users |
| Login funciona mas redireciona para 404 | Perfil não inserido na tabela `profiles` | Execute o `seed_demo_data.sql` no SQL Editor (passo 2.3) |
| "GEMINI_API_KEY não configurada" | Arquivo `backend/.env` ausente ou incorreto | Verifique se `backend/.env` existe com a chave correta |
| Erro de CORS no navegador | Backend não permite a origem do frontend | Configure a variável `FRONTEND_URL` (passo 8) |
| Build do backend falha | TypeScript não compila | Execute `cd backend && npx tsc` para ver os erros detalhados |
