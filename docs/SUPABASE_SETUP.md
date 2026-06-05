# Supabase Setup

Este guia explica como configurar o Supabase para autenticação real no frontend.

> **O que é o Supabase?** É um serviço online gratuito que funciona como banco de dados e sistema de login para o seu projeto. Você não precisa instalar nada no seu computador — tudo funciona pela internet.

---

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com.
2. Faça login na sua conta.
3. Clique em **New project**.
4. Escolha a organização.
5. Informe o nome do projeto.
6. Defina uma senha para o banco de dados.
7. Escolha a região mais adequada.
8. Clique em **Create new project**.

Depois que o projeto terminar de provisionar, você poderá configurar as variáveis do frontend e criar a tabela de perfis.

---

## 2. Encontrar as variáveis do frontend

No painel do Supabase:

1. Abra o projeto.
2. Vá em **Project Settings**.
3. Acesse **API**.
4. Copie os valores:

- `VITE_SUPABASE_URL`: use o valor de **Project URL**.
- `VITE_SUPABASE_ANON_KEY`: use o valor de **anon public key**.

---

## 3. Configurar `frontend/.env`

O projeto já inclui o arquivo `frontend/.env.example` com o formato correto. Para criar sua configuração:

1. Copie o arquivo `frontend/.env.example` e renomeie a cópia para `.env` (dentro da mesma pasta `frontend`).
2. Abra o `.env` em um editor de texto (VS Code, Notepad++, etc. — **não** use o Word).
3. Substitua os valores de exemplo pelos seus valores reais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

Depois de alterar variáveis de ambiente do Vite, reinicie o servidor de desenvolvimento:
- Vá ao terminal onde o servidor está rodando.
- Pressione **Ctrl + C** para parar o servidor.
- Digite `npm run dev` e pressione Enter para reiniciar.

---

## 4. Criar todas as tabelas do banco de dados

O projeto possui **dois scripts SQL** que configuram tudo automaticamente:

| Script | O que faz |
|--------|-----------|
| `setup_database.sql` | Cria as tabelas, regras de segurança (RLS), permissões e funções auxiliares. |
| `seed_demo_data.sql` | Cria os usuários de teste, projetos e vínculos. |

### Passo 4.1 — Criar a estrutura (`setup_database.sql`)

1. Abra o arquivo `setup_database.sql` que está na **raiz do projeto** (pasta principal).
2. No Supabase, abra o **SQL Editor** (menu lateral esquerdo, ícone com símbolo `>_`).
3. Clique em **New query**.
4. Copie **todo** o conteúdo do arquivo `setup_database.sql` e cole no editor.
5. Clique no botão verde **Run**.
6. Se aparecer "Success. No rows returned", deu certo!

> **Esse script cria:** as tabelas `profiles`, `projects`, `roles`, `project_members`, `questions`, `evaluations` e `final_evaluations`, junto com todas as regras de segurança (RLS), função `get_my_role()`, triggers e permissões.

### Passo 4.2 — Popular com dados de demonstração (`seed_demo_data.sql`)

1. No SQL Editor, clique em **New query** (uma nova query, não a mesma).
2. Abra o arquivo `seed_demo_data.sql` (também na raiz do projeto).
3. Copie **todo** o conteúdo e cole no editor.
4. Clique em **Run**.

Esse script cria automaticamente:
- 11 usuários com login funcional (senha: `Empresa@2026`)
- 11 cargos (roles)
- 5 projetos de exemplo
- Vínculos entre colaboradores e projetos

> **Importante:** Você **NÃO** precisa criar usuários manualmente na aba "Authentication > Users" do Supabase. O script já insere os registros diretamente nas tabelas `auth.users` e `auth.identities`, que é o equivalente a criar um usuário pela interface.

**Após executar, os seguintes usuários estarão disponíveis para login:**

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

**Validação:** No menu lateral do Supabase, abra **Table Editor**. Você deve ver as tabelas populadas. Em **Authentication > Users**, devem aparecer os 11 usuários.

---

## 5. Explicação do que os scripts fazem

O `setup_database.sql` cria:

| Componente | Descrição |
|------------|-----------|
| Tabela `profiles` | Nome, e-mail e cargo de cada usuário. Vinculada ao login (`auth.users`). |
| Tabela `projects` | Projetos da empresa (nome, descrição, status). |
| Tabela `roles` | Cargos disponíveis (Desenvolvedor, Designer, etc.). |
| Tabela `project_members` | Vínculos entre funcionários e projetos. |
| Tabela `questions` | Perguntas de avaliação técnica/comportamental. |
| Tabela `evaluations` | Feedbacks mensais registrados por líderes. |
| Tabela `final_evaluations` | Avaliação consolidada semestral. |
| Função `get_my_role()` | Função auxiliar que evita recursão nas policies de segurança. |
| Policies (RLS) | Regras de quem pode ver/editar cada tabela. |
| Triggers | Atualiza `updated_at` automaticamente ao editar registros. |
| Permissões | Garante que o Supabase funcione corretamente com as tabelas. |

O `seed_demo_data.sql` cria:

| Componente | Descrição |
|------------|-----------|
| Usuários em `auth.users` | 11 usuários com login funcional (equivalente a criar manualmente em Authentication > Users). |
| Identidades em `auth.identities` | Necessário para o login por e-mail/senha funcionar. |
| Perfis em `profiles` | Define o cargo de cada usuário no sistema. |
| Cargos em `roles` | 11 cargos usados nos projetos. |
| Projetos em `projects` | 5 projetos de exemplo. |
| Membros em `project_members` | Vínculos entre colaboradores e projetos. |

---

## 6. Recomeçar do zero (opcional)

Se precisar limpar tudo e começar de novo:

```sql
-- 1. Dropar tabelas
DROP TABLE IF EXISTS public.final_evaluations CASCADE;
DROP TABLE IF EXISTS public.evaluations CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Dropar funções
DROP FUNCTION IF EXISTS public.get_my_role();
DROP FUNCTION IF EXISTS public.set_updated_at();

-- 3. Limpar usuários de auth
DELETE FROM auth.identities;
DELETE FROM auth.users;
```

Depois é só executar `setup_database.sql` e `seed_demo_data.sql` novamente.

---

## 7. Roles aceitas

A coluna `role` aceita apenas:

- `admin`
- `technical-leader`
- `behavioral-leader`
- `employee`

Essas roles controlam o redirecionamento após login:

| Role | Redireciona para |
|------|-----------------|
| `admin` | `/admin` |
| `technical-leader` | `/technical-leader` |
| `behavioral-leader` | `/behavioral-leader` |
| `employee` | `/employee` |

---

## 8. Proteção por role no frontend

O frontend usa `profiles.role` para duas decisões:

- Redirecionar o usuário depois do login.
- Autorizar ou bloquear o acesso às rotas privadas.

O Supabase Auth gerencia a sessão do usuário automaticamente. Você **não** precisa salvar tokens ou senhas manualmente no código — o Supabase cuida disso.

As permissões de rota no frontend seguem esta regra:

- `admin`: acessa as rotas de admin, como `/admin`, `/admin/roles`, `/admin/questions` e `/admin/reports`.
- `technical-leader`: acessa as rotas técnicas, como `/technical-leader` e `/technical-leader/evaluate/:projectId/:employeeId`.
- `behavioral-leader`: acessa as rotas comportamentais, como `/behavioral-leader` e `/behavioral-leader/evaluate/:projectId/:employeeId`.
- `employee`: acessa as rotas de colaborador, como `/employee` e `/employee/history`.

A proteção no frontend melhora a experiência e evita navegação indevida, mas não substitui segurança no banco. Row Level Security (RLS) continua obrigatório no Supabase para proteger dados diretamente na base.

---

## 9. Testar login, logout e proteção de rotas

1. Configure `frontend/.env` (veja passo 3).
2. Reinicie o servidor Vite: no terminal, pressione **Ctrl + C** para parar, depois digite `npm run dev` e pressione Enter.
3. Abra a aplicação no navegador (geralmente http://localhost:5173).
4. Faça login com qualquer usuário da tabela acima (ex: `admin@empresa.com` / `Empresa@2026`).
5. Confirme se o usuário é redirecionado para a rota correta conforme a role em `profiles`.
6. Clique em **Sair** em um dashboard.
7. Confirme que o logout redireciona para `/`.
8. Tente acessar diretamente uma rota privada, como `/admin` ou `/employee/history`, sem sessão.
9. Confirme que a aplicação redireciona para `/`.
