# Supabase Setup

Este guia explica como configurar o Supabase para autenticação real no frontend.

> **O que é o Supabase?** É um serviço online gratuito que funciona como banco de dados e sistema de login para o seu projeto. Você não precisa instalar nada no seu computador — tudo funciona pela internet.

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

## 2. Encontrar as variáveis do frontend

No painel do Supabase:

1. Abra o projeto.
2. Vá em **Project Settings**.
3. Acesse **API**.
4. Copie os valores:

- `VITE_SUPABASE_URL`: use o valor de **Project URL**.
- `VITE_SUPABASE_ANON_KEY`: use o valor de **anon public key**.

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

## 4. Criar tabela `profiles`

Esta tabela armazena as informações de perfil de cada usuário (nome, e-mail e cargo/role).

No Supabase:

1. Abra **SQL Editor** (no menu lateral esquerdo, é o ícone com símbolo de código `>_`).
2. Crie uma nova query (clique em **New query**).
3. Copie **todo** o SQL abaixo e cole no editor. Depois clique em **Run** (botão verde no canto inferior direito).

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (
    role in ('admin', 'technical-leader', 'behavioral-leader', 'employee')
  ),
  created_at timestamptz default now()
);
```

> **O que esse SQL faz:** Cria uma tabela chamada `profiles` que guarda o ID do usuário (ligado ao sistema de login), nome, e-mail e cargo. Se um usuário for deletado do login, o perfil dele também é removido automaticamente (`on delete cascade`).

## 5. Ativar Row Level Security

Row Level Security (RLS) é uma proteção do banco de dados que impede que um usuário acesse dados de outro. **É obrigatório ativá-lo.**

No SQL Editor, execute:

```sql
alter table public.profiles enable row level security;
```

> Após ativar o RLS, ninguém consegue ler dados da tabela até que você crie "políticas" (rules) dizendo quem pode ver o quê. É isso que faremos nos passos 6 e 7.

## 6. Policy para usuário ler o próprio perfil

Esta regra permite que cada usuário veja **apenas o próprio perfil** (nome, e-mail, cargo). Ele não consegue ver dados de outras pessoas.

No SQL Editor, execute:

```sql
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);
```

## 7. Policy para admin ler todos os perfis

Esta regra permite que usuários com cargo `admin` vejam **todos** os perfis. Isso é necessário para o administrador gerenciar os funcionários.

No SQL Editor, execute:

```sql
create policy "Admins can read all profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);
```

## 8. SQL completo

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (
    role in ('admin', 'technical-leader', 'behavioral-leader', 'employee')
  ),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);
```

## 9. Criar usuários

No Supabase:

1. Acesse **Authentication**.
2. Abra **Users**.
3. Clique em **Add user**.
4. Informe o e-mail e a senha.
5. Confirme a criação do usuário.
6. Copie o `User UID` gerado. Ele será usado como `id` na tabela `profiles`.

## 10. Inserir perfil com role

Depois de criar o usuário em **Authentication > Users**, insira o perfil correspondente na tabela `profiles`.

Exemplo:

```sql
insert into public.profiles (id, name, email, role)
values (
  'USER_UID_AQUI',
  'Nome do Usuario',
  'usuario@empresa.com',
  'employee'
);
```

Substitua `USER_UID_AQUI` pelo `User UID` do usuário criado no Supabase Auth.

## 11. Roles aceitas

A coluna `role` aceita apenas:

- `admin`
- `technical-leader`
- `behavioral-leader`
- `employee`

Essas roles controlam o redirecionamento após login:

- `admin` -> `/admin`
- `technical-leader` -> `/technical-leader`
- `behavioral-leader` -> `/behavioral-leader`
- `employee` -> `/employee`

## 12. Proteção por role no frontend

O frontend usa `profiles.role` para duas decisões:

- Redirecionar o usuário depois do login.
- Autorizar ou bloquear o acesso às rotas privadas.

O Supabase Auth gerencia a sessão do usuário automaticamente. Você **não** precisa salvar tokens ou senhas manualmente no código — o Supabase cuida disso.

As permissões de rota no frontend seguem esta regra:

- `admin`: acessa as rotas de admin, como `/admin`, `/admin/roles`, `/admin/questions` e `/admin/reports`.
- `technical-leader`: acessa as rotas tecnicas, como `/technical-leader` e `/technical-leader/evaluate/:projectId/:employeeId`.
- `behavioral-leader`: acessa as rotas comportamentais, como `/behavioral-leader` e `/behavioral-leader/evaluate/:projectId/:employeeId`.
- `employee`: acessa as rotas de colaborador, como `/employee` e `/employee/history`.

A protecao no frontend melhora a experiencia e evita navegacao indevida, mas nao substitui seguranca no banco. Row Level Security (RLS) continua obrigatorio no Supabase para proteger dados, queries e operacoes diretamente na base.

## 13. Testar login, logout e proteção de rotas

1. Configure `frontend/.env` (veja passo 3).
2. Reinicie o servidor Vite: no terminal, pressione **Ctrl + C** para parar, depois digite `npm run dev` e pressione Enter.
3. Abra a aplicação no navegador (geralmente http://localhost:5173).
4. Faça login com o e-mail e senha criados em **Authentication > Users**.
5. Confirme se o usuário é redirecionado para a rota correta conforme a role em `profiles`.
6. Clique em **Sair** em um dashboard.
7. Confirme que o logout redireciona para `/`.
8. Tente acessar diretamente uma rota privada, como `/admin` ou `/employee/history`, sem sessão.
9. Confirme que a aplicação redireciona para `/`.
