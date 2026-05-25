-- =============================================================
-- Migration: Avaliações Finais Consolidadas
-- Execute este script no SQL Editor do Supabase
-- =============================================================

-- 1. Criar tabela final_evaluations
-- =============================================================
CREATE TABLE IF NOT EXISTS public.final_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL,
  period TEXT NOT NULL, -- Formato: 'YYYY-S1' ou 'YYYY-S2'

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_approval', 'published')),

  -- Avaliação Técnica
  technical_scores JSONB DEFAULT '{}',
  -- Ex: {"Qualidade": 4, "Desempenho": 3, "Aprendizado": 5, "Mentoria": 4, "Arquitetura": 3}
  technical_summary TEXT,

  -- Avaliação Comportamental
  behavioral_scores JSONB DEFAULT '{}',
  -- Ex: {"Comunicação": 4, "Proatividade": 5, "Colaboração": 4, "Iniciativa": 3, "Liderança": 4}
  behavioral_summary TEXT,

  -- Avaliação Geral
  overall_recommendation TEXT,
  career_recommendation TEXT
    CHECK (career_recommendation IN ('efetivação', 'promoção', 'permanência', 'desligamento')),

  -- Insights gerados pela IA
  ai_insights JSONB,
  -- Ex: {"positive_evolution": [], "recurring_issues": [], "score_suggestions": {...},
  --      "technical_summary": "...", "behavioral_summary": "...", "trends": [], "career_recommendation": "..."}

  -- Quem criou
  created_by UUID,

  -- Aprovação: Líder Técnico
  tech_approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (tech_approval_status IN ('pending', 'approved', 'rejected')),
  tech_approved_by UUID,
  tech_approved_at TIMESTAMPTZ,
  tech_approval_comments TEXT,

  -- Aprovação: Líder Comportamental
  behavioral_approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (behavioral_approval_status IN ('pending', 'approved', 'rejected')),
  behavioral_approved_by UUID,
  behavioral_approved_at TIMESTAMPTZ,
  behavioral_approval_comments TEXT,

  -- Aprovação: RH / Admin
  hr_approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (hr_approval_status IN ('pending', 'approved', 'rejected')),
  hr_approved_by UUID,
  hr_approved_at TIMESTAMPTZ,
  hr_approval_comments TEXT,

  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ativar RLS
-- =============================================================
ALTER TABLE public.final_evaluations ENABLE ROW LEVEL SECURITY;

-- 3. RLS: Colaboradores só veem suas próprias avaliações publicadas
-- =============================================================
CREATE POLICY "employee_read_own_published"
  ON public.final_evaluations
  FOR SELECT
  TO authenticated
  USING (
    employee_id = auth.uid()
    AND status = 'published'
  );

-- 4. RLS: Líderes e admins têm acesso completo
-- =============================================================
CREATE POLICY "leaders_and_admins_full_access"
  ON public.final_evaluations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('technical-leader', 'behavioral-leader', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('technical-leader', 'behavioral-leader', 'admin')
    )
  );

-- 5. Trigger: atualizar updated_at automaticamente
-- =============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER final_evaluations_updated_at
  BEFORE UPDATE ON public.final_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 6. Atualizar RLS da tabela evaluations (feedbacks recorrentes agora são privados)
-- =============================================================
-- ATENÇÃO: Se existirem policies que permitem que colaboradores leiam a tabela
-- 'evaluations', elas devem ser removidas. Execute o bloco abaixo conforme
-- os nomes das policies existentes no seu projeto Supabase.
-- Para verificar policies existentes: SELECT * FROM pg_policies WHERE tablename = 'evaluations';

-- Exemplo (ajuste os nomes conforme necessário):
-- DROP POLICY IF EXISTS "employees_read_own_evaluations" ON public.evaluations;
-- DROP POLICY IF EXISTS "allow_employee_read" ON public.evaluations;

-- Se a tabela não tiver RLS ativa, ative e crie apenas a policy para líderes/admin:
-- ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "leaders_read_evaluations"
--   ON public.evaluations
--   FOR SELECT
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid()
--         AND role IN ('technical-leader', 'behavioral-leader', 'admin')
--     )
--     OR leader_id = auth.uid()
--   );

-- 7. Dados de exemplo para desenvolvimento (opcional)
-- =============================================================
-- Substitua os UUIDs pelos IDs reais dos seus usuários de teste.
-- INSERT INTO public.final_evaluations (
--   employee_id, period, status,
--   technical_scores, technical_summary,
--   behavioral_scores, behavioral_summary,
--   overall_recommendation, career_recommendation,
--   created_by,
--   tech_approval_status, behavioral_approval_status, hr_approval_status,
--   published_at
-- ) VALUES (
--   '<employee-uuid>', '2025-S2', 'published',
--   '{"Qualidade": 4, "Desempenho": 4, "Aprendizado": 5, "Mentoria": 3, "Arquitetura": 4}',
--   'Excelente desempenho técnico no semestre, com destaque para a evolução em arquitetura de sistemas.',
--   '{"Comunicação": 4, "Proatividade": 5, "Colaboração": 4, "Iniciativa": 4, "Liderança": 3}',
--   'Demonstrou alta proatividade e boa colaboração com a equipe.',
--   'Colaborador com excelente evolução no período. Recomendado para promoção.',
--   'promoção',
--   '<created-by-uuid>',
--   'approved', 'approved', 'approved',
--   NOW()
-- );
