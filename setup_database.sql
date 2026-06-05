-- =============================================================
-- SCRIPT COMPLETO DE SETUP DO BANCO DE DADOS
-- Feedback Project — Sistema de Gestão de Desempenho
-- =============================================================
--
-- COMO USAR:
-- 1. Abra o Supabase (https://supabase.com) e acesse seu projeto.
-- 2. No menu lateral esquerdo, clique em "SQL Editor" (ícone >_).
-- 3. Clique em "New query".
-- 4. Copie TODO o conteúdo deste arquivo e cole no editor.
-- 5. Clique no botão verde "Run" (canto inferior direito).
-- 6. Se aparecer "Success. No rows returned", deu certo!
--
-- IMPORTANTE: Execute este script APENAS UMA VEZ em um projeto novo.
-- Se o banco já tiver tabelas criadas, este script vai falhar.
-- =============================================================


-- =============================================================
-- PARTE 1: CRIAR TABELAS
-- (na ordem correta para respeitar dependências)
-- =============================================================

-- 1.1 Tabela: profiles
-- Armazena nome, e-mail e cargo de cada usuário.
-- O ID vem do sistema de login (Supabase Auth).
create table public.profiles (
  id uuid not null,
  name text not null,
  email text not null unique,
  role text not null check (
    role in ('admin', 'technical-leader', 'behavioral-leader', 'employee')
  ),
  created_at timestamp with time zone default now(),
  department text,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade
);

-- 1.2 Tabela: projects
-- Armazena os projetos da empresa.
create table public.projects (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'active' check (
    status in ('active', 'completed')
  ),
  created_at timestamp with time zone not null default now(),
  start_date date,
  end_date date,
  constraint projects_pkey primary key (id)
);

-- 1.3 Tabela: roles (cargos)
-- Armazena os cargos disponíveis na empresa (ex: Desenvolvedor, Designer).
create table public.roles (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text,
  department text,
  created_at timestamp with time zone not null default now(),
  constraint roles_pkey primary key (id)
);

-- 1.4 Tabela: project_members
-- Relaciona funcionários aos projetos em que participam.
create table public.project_members (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null,
  employee_id uuid not null,
  role_in_project text,
  created_at timestamp with time zone not null default now(),
  role text,
  hours_allocated integer,
  status text default 'active',
  constraint project_members_pkey primary key (id),
  constraint project_members_project_id_fkey foreign key (project_id) references public.projects(id),
  constraint project_members_employee_id_fkey foreign key (employee_id) references public.profiles(id)
);

-- 1.5 Tabela: questions
-- Perguntas de avaliação (técnicas e comportamentais).
create table public.questions (
  id uuid not null default gen_random_uuid(),
  text text not null,
  type text not null check (
    type in ('technical', 'behavioral')
  ),
  role_id uuid,
  category text,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  role_name text,
  constraint questions_pkey primary key (id),
  constraint questions_role_id_fkey foreign key (role_id) references public.roles(id)
);

-- 1.6 Tabela: evaluations
-- Feedbacks recorrentes (mensais) registrados por líderes.
create table public.evaluations (
  id uuid not null default gen_random_uuid(),
  evaluation_type text not null check (
    evaluation_type in ('technical', 'behavioral')
  ),
  project_id text not null,
  employee_id text not null,
  leader_id uuid not null,
  period text not null check (period ~ '^\d{4}-\d{2}$'),
  answers jsonb not null default '{}'::jsonb,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint evaluations_pkey primary key (id),
  constraint evaluations_leader_id_fkey foreign key (leader_id) references auth.users(id)
);

-- 1.7 Tabela: final_evaluations
-- Avaliação consolidada semestral de cada colaborador.
create table public.final_evaluations (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  period text not null,
  status text not null default 'draft' check (
    status in ('draft', 'pending_approval', 'published')
  ),
  technical_scores jsonb not null default '{}'::jsonb,
  technical_summary text,
  behavioral_scores jsonb not null default '{}'::jsonb,
  behavioral_summary text,
  overall_recommendation text,
  career_recommendation text check (
    career_recommendation in ('efetivação', 'promoção', 'permanência', 'desligamento')
  ),
  ai_insights jsonb,
  created_by uuid,
  tech_approval_status text not null default 'pending' check (
    tech_approval_status in ('pending', 'approved', 'rejected')
  ),
  tech_approved_by uuid,
  tech_approved_at timestamp with time zone,
  tech_comments text,
  behavioral_approval_status text not null default 'pending' check (
    behavioral_approval_status in ('pending', 'approved', 'rejected')
  ),
  behavioral_approved_by uuid,
  behavioral_approved_at timestamp with time zone,
  behavioral_comments text,
  hr_approval_status text not null default 'pending' check (
    hr_approval_status in ('pending', 'approved', 'rejected')
  ),
  hr_approved_by uuid,
  hr_approved_at timestamp with time zone,
  hr_comments text,
  published_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint final_evaluations_pkey primary key (id),
  constraint final_evaluations_employee_id_fkey foreign key (employee_id) references public.profiles(id),
  constraint final_evaluations_created_by_fkey foreign key (created_by) references public.profiles(id),
  constraint final_evaluations_tech_approved_by_fkey foreign key (tech_approved_by) references public.profiles(id),
  constraint final_evaluations_behavioral_approved_by_fkey foreign key (behavioral_approved_by) references public.profiles(id),
  constraint final_evaluations_hr_approved_by_fkey foreign key (hr_approved_by) references public.profiles(id)
);


-- =============================================================
-- PARTE 2: ATIVAR ROW LEVEL SECURITY (RLS)
-- Impede que usuários acessem dados que não são deles.
-- =============================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.roles enable row level security;
alter table public.project_members enable row level security;
alter table public.questions enable row level security;
alter table public.evaluations enable row level security;
alter table public.final_evaluations enable row level security;


-- =============================================================
-- PARTE 3: POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- Definem quem pode ver/editar cada tabela.
-- =============================================================

-- Função auxiliar: retorna o role do usuário logado SEM passar pelo RLS.
-- Isso evita o erro "infinite recursion detected in policy for relation profiles".
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- --- profiles ---

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.get_my_role() = 'admin');

create policy "Leaders can read all profiles"
  on public.profiles for select
  using (public.get_my_role() in ('technical-leader', 'behavioral-leader'));

create policy "Admins can manage profiles"
  on public.profiles for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

-- --- projects ---

create policy "Authenticated users can read projects"
  on public.projects for select
  to authenticated
  using (true);

create policy "Admins can manage projects"
  on public.projects for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- roles (cargos) ---

create policy "Authenticated users can read roles"
  on public.roles for select
  to authenticated
  using (true);

create policy "Admins can manage roles"
  on public.roles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- project_members ---

create policy "Authenticated users can read project_members"
  on public.project_members for select
  to authenticated
  using (true);

create policy "Admins can manage project_members"
  on public.project_members for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- questions ---

create policy "Authenticated users can read questions"
  on public.questions for select
  to authenticated
  using (true);

create policy "Admins can manage questions"
  on public.questions for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- evaluations ---

create policy "Leaders can manage evaluations"
  on public.evaluations for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('technical-leader', 'behavioral-leader', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('technical-leader', 'behavioral-leader', 'admin')
    )
  );

-- --- final_evaluations ---

create policy "Employees can read own published final evaluations"
  on public.final_evaluations for select
  to authenticated
  using (
    employee_id = auth.uid() and status = 'published'
  );

create policy "Leaders and admins full access to final_evaluations"
  on public.final_evaluations for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('technical-leader', 'behavioral-leader', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('technical-leader', 'behavioral-leader', 'admin')
    )
  );


-- =============================================================
-- PARTE 4: TRIGGER PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =============================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger evaluations_updated_at
  before update on public.evaluations
  for each row execute function public.set_updated_at();

create trigger final_evaluations_updated_at
  before update on public.final_evaluations
  for each row execute function public.set_updated_at();


-- =============================================================
-- PARTE 5: PERMISSÕES PÚBLICAS DO SUPABASE
-- Garante que o Supabase funcione corretamente com as tabelas.
-- =============================================================

grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant usage on schema public to service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all functions in schema public to service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

alter default privileges in schema public
  grant all privileges on tables to service_role;
alter default privileges in schema public
  grant all privileges on sequences to service_role;
alter default privileges in schema public
  grant all privileges on functions to service_role;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to authenticated;
alter default privileges in schema public
  grant execute on functions to authenticated;


-- =============================================================
-- PARTE 6: PRÓXIMO PASSO — DADOS DE DEMONSTRAÇÃO
-- =============================================================
-- O banco está pronto! Para popular com dados de teste (usuários,
-- projetos e vínculos), execute o arquivo:
--
--   seed_demo_data.sql
--
-- Esse script cria automaticamente:
-- - 11 usuários com login funcional (senha: Empresa@2026)
-- - 5 projetos de exemplo
-- - Vínculos entre colaboradores e projetos
--
-- Basta abrir uma nova query no SQL Editor, colar o conteúdo
-- do arquivo seed_demo_data.sql e clicar em Run.
-- =============================================================


-- =============================================================
-- FIM DO SCRIPT DE ESTRUTURA
-- Se chegou aqui sem erros, as tabelas e regras estão prontas!
-- =============================================================
