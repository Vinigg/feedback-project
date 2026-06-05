-- =============================================================
-- SCRIPT DE DADOS DE DEMONSTRAÇÃO (SEED)
-- Feedback Project — Sistema de Gestão de Desempenho
-- =============================================================
--
-- COMO USAR:
-- 1. Execute PRIMEIRO o "setup_database.sql" para criar as tabelas.
-- 2. Depois, abra o SQL Editor no Supabase.
-- 3. Clique em "New query".
-- 4. Copie TODO o conteúdo deste arquivo e cole no editor.
-- 5. Clique no botão verde "Run".
-- 6. Se aparecer "Success. No rows returned", deu certo!
--
-- O QUE ESTE SCRIPT FAZ:
-- - Cria 4 usuários principais (admin, colaborador, líder técnico,
--   líder comportamental) + 7 colaboradores de demonstração.
-- - Cria 5 projetos de exemplo.
-- - Vincula os colaboradores aos projetos.
--
-- SENHA PADRÃO DE TODOS OS USUÁRIOS: Empresa@2026
-- =============================================================


DO $$
DECLARE
  -- IDs dos usuários principais
  v_admin        uuid := gen_random_uuid();
  v_colaborador  uuid := gen_random_uuid();
  v_lider_rh     uuid := gen_random_uuid();
  v_lider_tech   uuid := gen_random_uuid();

  -- IDs dos colaboradores
  v_ana     uuid := gen_random_uuid();
  v_carlos  uuid := gen_random_uuid();
  v_julia   uuid := gen_random_uuid();
  v_pedro   uuid := gen_random_uuid();
  v_mariana uuid := gen_random_uuid();
  v_roberto uuid := gen_random_uuid();
  v_lucia   uuid := gen_random_uuid();

  -- IDs dos projetos
  p_dashboard uuid := gen_random_uuid();
  p_campanha  uuid := gen_random_uuid();
  p_portal    uuid := gen_random_uuid();
  p_mobile    uuid := gen_random_uuid();
  p_automacao uuid := gen_random_uuid();

BEGIN

  -- ============================================================
  -- PASSO 1: Criar usuários no sistema de autenticação
  -- ============================================================
  -- Isso é equivalente a criar manualmente em Authentication > Users,
  -- mas feito via SQL para facilitar.

  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, is_sso_user,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change, email_change_token_new, email_change_token_current
  ) VALUES
    -- Usuários principais
    (v_admin,       '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@empresa.com',          crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_colaborador, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'colaborador@empresa.com',    crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_lider_rh,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rh@empresa.com',             crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_lider_tech,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tech@empresa.com',           crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    -- Colaboradores de demonstração
    (v_ana,         '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ana.silva@empresa.com',      crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_carlos,      '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carlos.mendes@empresa.com',  crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_julia,       '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'julia.costa@empresa.com',    crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_pedro,       '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pedro.alves@empresa.com',    crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_mariana,     '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mariana.lima@empresa.com',   crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_roberto,     '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'roberto.santos@empresa.com', crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', ''),
    (v_lucia,       '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lucia.ferreira@empresa.com', crypt('Empresa@2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', false, false, now(), now(), '', '', '', '', '');

  -- Criar identidades (necessário para login funcionar no Supabase)
  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES
    (gen_random_uuid(), v_admin,       v_admin::text,       json_build_object('sub', v_admin::text,       'email', 'admin@empresa.com'),          'email', now(), now(), now()),
    (gen_random_uuid(), v_colaborador, v_colaborador::text, json_build_object('sub', v_colaborador::text, 'email', 'colaborador@empresa.com'),    'email', now(), now(), now()),
    (gen_random_uuid(), v_lider_rh,    v_lider_rh::text,    json_build_object('sub', v_lider_rh::text,    'email', 'rh@empresa.com'),             'email', now(), now(), now()),
    (gen_random_uuid(), v_lider_tech,  v_lider_tech::text,  json_build_object('sub', v_lider_tech::text,  'email', 'tech@empresa.com'),           'email', now(), now(), now()),
    (gen_random_uuid(), v_ana,         v_ana::text,         json_build_object('sub', v_ana::text,         'email', 'ana.silva@empresa.com'),      'email', now(), now(), now()),
    (gen_random_uuid(), v_carlos,      v_carlos::text,      json_build_object('sub', v_carlos::text,      'email', 'carlos.mendes@empresa.com'),  'email', now(), now(), now()),
    (gen_random_uuid(), v_julia,       v_julia::text,       json_build_object('sub', v_julia::text,       'email', 'julia.costa@empresa.com'),    'email', now(), now(), now()),
    (gen_random_uuid(), v_pedro,       v_pedro::text,       json_build_object('sub', v_pedro::text,       'email', 'pedro.alves@empresa.com'),    'email', now(), now(), now()),
    (gen_random_uuid(), v_mariana,     v_mariana::text,     json_build_object('sub', v_mariana::text,     'email', 'mariana.lima@empresa.com'),   'email', now(), now(), now()),
    (gen_random_uuid(), v_roberto,     v_roberto::text,     json_build_object('sub', v_roberto::text,     'email', 'roberto.santos@empresa.com'), 'email', now(), now(), now()),
    (gen_random_uuid(), v_lucia,       v_lucia::text,       json_build_object('sub', v_lucia::text,       'email', 'lucia.ferreira@empresa.com'), 'email', now(), now(), now());


  -- ============================================================
  -- PASSO 2: Criar perfis na tabela profiles
  -- ============================================================
  -- Cada usuário precisa de um perfil que define seu cargo no sistema.

  INSERT INTO public.profiles (id, name, email, role) VALUES
    -- Usuários principais
    (v_admin,       'Administrador',        'admin@empresa.com',          'admin'),
    (v_colaborador, 'Colaborador',          'colaborador@empresa.com',    'employee'),
    (v_lider_rh,    'Líder Comportamental', 'rh@empresa.com',             'behavioral-leader'),
    (v_lider_tech,  'Líder Técnico',        'tech@empresa.com',           'technical-leader'),
    -- Colaboradores de demonstração
    (v_ana,         'Ana Silva',            'ana.silva@empresa.com',      'employee'),
    (v_carlos,      'Carlos Mendes',        'carlos.mendes@empresa.com',  'employee'),
    (v_julia,       'Julia Costa',          'julia.costa@empresa.com',    'employee'),
    (v_pedro,       'Pedro Alves',          'pedro.alves@empresa.com',    'employee'),
    (v_mariana,     'Mariana Lima',         'mariana.lima@empresa.com',   'employee'),
    (v_roberto,     'Roberto Santos',       'roberto.santos@empresa.com', 'employee'),
    (v_lucia,       'Lucia Ferreira',       'lucia.ferreira@empresa.com', 'employee');


  -- ============================================================
  -- PASSO 3: Criar cargos na tabela roles
  -- ============================================================
  -- Cargos que os colaboradores exercem nos projetos.

  INSERT INTO public.roles (name, description) VALUES
    ('Analista de Marketing',      'Cargo sincronizado de project_members: Analista de Marketing'),
    ('Analista de Requisitos',     'Cargo sincronizado de project_members: Analista de Requisitos'),
    ('Desenvolvedor Backend',      'Cargo sincronizado de project_members: Desenvolvedor Backend'),
    ('Desenvolvedor Frontend',     'Cargo sincronizado de project_members: Desenvolvedor Frontend'),
    ('Desenvolvedor Full Stack',   'Cargo sincronizado de project_members: Desenvolvedor Full Stack'),
    ('Desenvolvedor Mobile',       'Cargo sincronizado de project_members: Desenvolvedor Mobile'),
    ('DevOps Engineer',            'Cargo sincronizado de project_members: DevOps Engineer'),
    ('Product Manager',            'Cargo sincronizado de project_members: Product Manager'),
    ('QA Engineer',                'Cargo sincronizado de project_members: QA Engineer'),
    ('Redatora',                   'Cargo sincronizado de project_members: Redatora'),
    ('UX Designer',                'Cargo sincronizado de project_members: UX Designer');


  -- ============================================================
  -- PASSO 4: Criar projetos
  -- ============================================================

  INSERT INTO public.projects (id, name, description, status, start_date, end_date) VALUES
    (p_dashboard, 'Dashboard Executivo',    'Painel de indicadores para a diretoria com dados em tempo real.',         'active',    '2026-01-15', null),
    (p_campanha,  'Campanha Digital 2026',  'Campanha de marketing digital para lançamento do novo produto.',          'active',    '2026-03-01', '2026-08-30'),
    (p_portal,    'Portal do Cliente',      'Portal web para clientes acompanharem pedidos e suporte.',                'active',    '2026-02-01', null),
    (p_mobile,    'App Mobile Interno',     'Aplicativo mobile para comunicação interna e gestão de tarefas.',         'active',    '2026-04-01', null),
    (p_automacao, 'Automação de Deploy',    'Pipeline CI/CD para automatizar deploys em ambientes de staging e prod.', 'completed', '2025-10-01', '2026-03-15');


  -- ============================================================
  -- PASSO 5: Vincular colaboradores aos projetos
  -- ============================================================
  -- Cada colaborador pode participar de um ou mais projetos,
  -- com um cargo específico dentro de cada um.

  INSERT INTO public.project_members (id, project_id, employee_id, role_in_project, role, hours_allocated, status) VALUES
    -- Dashboard Executivo
    (gen_random_uuid(), p_dashboard, v_ana,     'Desenvolvedor Frontend',   'employee', 40, 'active'),
    (gen_random_uuid(), p_dashboard, v_carlos,  'Desenvolvedor Backend',    'employee', 40, 'active'),
    (gen_random_uuid(), p_dashboard, v_julia,   'UX Designer',              'employee', 20, 'active'),

    -- Campanha Digital 2026
    (gen_random_uuid(), p_campanha,  v_julia,   'Analista de Marketing',    'employee', 40, 'active'),
    (gen_random_uuid(), p_campanha,  v_mariana, 'Redatora',                 'employee', 30, 'active'),
    (gen_random_uuid(), p_campanha,  v_pedro,   'Desenvolvedor Frontend',   'employee', 20, 'active'),

    -- Portal do Cliente
    (gen_random_uuid(), p_portal,    v_pedro,   'Desenvolvedor Full Stack', 'employee', 40, 'active'),
    (gen_random_uuid(), p_portal,    v_roberto, 'QA Engineer',              'employee', 30, 'active'),
    (gen_random_uuid(), p_portal,    v_lucia,   'Analista de Requisitos',   'employee', 20, 'active'),

    -- App Mobile Interno
    (gen_random_uuid(), p_mobile,    v_carlos,  'Desenvolvedor Mobile',     'employee', 40, 'active'),
    (gen_random_uuid(), p_mobile,    v_mariana, 'Product Manager',          'employee', 20, 'active'),
    (gen_random_uuid(), p_mobile,    v_roberto, 'Desenvolvedor Backend',    'employee', 30, 'active'),

    -- Automação de Deploy (projeto concluído)
    (gen_random_uuid(), p_automacao, v_lucia,   'DevOps Engineer',          'employee', 40, 'active'),
    (gen_random_uuid(), p_automacao, v_ana,     'Desenvolvedor Backend',    'employee', 30, 'active');


  -- ============================================================
  -- PASSO 6: Criar perguntas de avaliação
  -- ============================================================
  -- Perguntas técnicas (usadas pelo líder técnico)
  -- e comportamentais (usadas pelo líder comportamental).

  -- Perguntas TÉCNICAS
  INSERT INTO public.questions (text, type, category, is_active) VALUES
    -- Qualidade de Código
    ('O colaborador entrega código limpo, legível e bem estruturado?', 'technical', 'Qualidade de Código', true),
    ('O colaborador aplica boas práticas como SOLID, DRY e separação de responsabilidades?', 'technical', 'Qualidade de Código', true),
    ('O colaborador escreve testes unitários ou de integração para suas entregas?', 'technical', 'Qualidade de Código', true),
    -- Resolução de Problemas
    ('O colaborador demonstra capacidade de diagnosticar e resolver bugs complexos?', 'technical', 'Resolução de Problemas', true),
    ('O colaborador propõe soluções criativas para desafios técnicos?', 'technical', 'Resolução de Problemas', true),
    -- Conhecimento Técnico
    ('O colaborador domina as tecnologias utilizadas no projeto?', 'technical', 'Conhecimento Técnico', true),
    ('O colaborador busca se atualizar sobre novas ferramentas e práticas do mercado?', 'technical', 'Conhecimento Técnico', true),
    -- Entregas e Prazos
    ('O colaborador cumpre os prazos acordados para suas tarefas?', 'technical', 'Entregas e Prazos', true),
    ('O colaborador comunica proativamente quando identifica riscos de atraso?', 'technical', 'Entregas e Prazos', true);

  -- Perguntas COMPORTAMENTAIS
  INSERT INTO public.questions (text, type, category, is_active) VALUES
    -- Comunicação
    ('O colaborador se comunica de forma clara e objetiva com a equipe?', 'behavioral', 'Comunicação', true),
    ('O colaborador sabe ouvir feedbacks e opiniões divergentes com respeito?', 'behavioral', 'Comunicação', true),
    ('O colaborador compartilha conhecimento com colegas quando solicitado?', 'behavioral', 'Comunicação', true),
    -- Trabalho em Equipe
    ('O colaborador colabora ativamente com outros membros do time?', 'behavioral', 'Trabalho em Equipe', true),
    ('O colaborador se oferece para ajudar colegas que estão com dificuldades?', 'behavioral', 'Trabalho em Equipe', true),
    -- Proatividade
    ('O colaborador toma iniciativa para melhorar processos ou resolver problemas?', 'behavioral', 'Proatividade', true),
    ('O colaborador identifica oportunidades de melhoria sem precisar ser cobrado?', 'behavioral', 'Proatividade', true),
    -- Comprometimento
    ('O colaborador demonstra responsabilidade e ownership sobre suas entregas?', 'behavioral', 'Comprometimento', true),
    ('O colaborador está alinhado com os objetivos e valores da equipe?', 'behavioral', 'Comprometimento', true),
    -- Adaptabilidade
    ('O colaborador lida bem com mudanças de prioridade ou escopo?', 'behavioral', 'Adaptabilidade', true),
    ('O colaborador mantém produtividade mesmo em situações de pressão?', 'behavioral', 'Adaptabilidade', true);

END $$;


-- =============================================================
-- FIM DO SCRIPT DE DEMONSTRAÇÃO
-- =============================================================
-- Agora você pode fazer login no sistema com qualquer usuário:
--
-- CREDENCIAIS DE ACESSO:
-- ┌────────────────────────────┬───────────────────────────┬─────────────┐
-- │ Nome                       │ E-mail                    │ Senha       │
-- ├────────────────────────────┼───────────────────────────┼─────────────┤
-- │ Administrador              │ admin@empresa.com         │ Empresa@2026│
-- │ Líder Técnico              │ tech@empresa.com          │ Empresa@2026│
-- │ Líder Comportamental       │ rh@empresa.com            │ Empresa@2026│
-- │ Colaborador                │ colaborador@empresa.com   │ Empresa@2026│
-- │ Ana Silva                  │ ana.silva@empresa.com     │ Empresa@2026│
-- │ Carlos Mendes              │ carlos.mendes@empresa.com │ Empresa@2026│
-- │ Julia Costa                │ julia.costa@empresa.com   │ Empresa@2026│
-- │ Pedro Alves                │ pedro.alves@empresa.com   │ Empresa@2026│
-- │ Mariana Lima               │ mariana.lima@empresa.com  │ Empresa@2026│
-- │ Roberto Santos             │ roberto.santos@empresa.com│ Empresa@2026│
-- │ Lucia Ferreira             │ lucia.ferreira@empresa.com│ Empresa@2026│
-- └────────────────────────────┴───────────────────────────┴─────────────┘
--
-- PROJETOS CRIADOS:
-- - Dashboard Executivo (ativo)
-- - Campanha Digital 2026 (ativo)
-- - Portal do Cliente (ativo)
-- - App Mobile Interno (ativo)
-- - Automação de Deploy (concluído)
-- =============================================================
