# Entrega Final | Residencia em Software & IA

Prazo de entrega: preencher com a data definida pela residencia.

## 1. Link dos arquivos do MVP "AI-Powered"

### 1.1 Codigo-fonte e integracoes de IA

Repositorio do projeto:

- https://github.com/Vinigg/feedback-project

O MVP e um sistema de gestao de feedbacks e avaliacoes de desempenho desenvolvido para a Mesa Tech no contexto do Embarque Digital. A aplicacao possui:

- Frontend em React, TypeScript e Vite.
- Backend em Node.js, Express e TypeScript.
- Banco, autenticacao e seguranca via Supabase.
- Integracao de IA com Gemini para gerar insights de avaliacao final a partir de feedbacks recorrentes.

Arquivos principais da integracao de IA:

- `backend/src/services/gemini.service.ts`: monta o prompt, chama a API Gemini e interpreta o JSON retornado.
- `backend/src/controllers/ai.controller.ts`: valida a requisicao e trata erros da chamada de IA.
- `backend/src/routes/ai.routes.ts`: expoe a rota `POST /api/ai/analyze-feedbacks`.
- `frontend/src/services/aiService.ts`: envia feedbacks filtrados do frontend para o backend.
- `frontend/src/pages/FinalEvaluationForm.tsx`: botao "Gerar Insights com IA", preenchimento assistido de notas, resumos e recomendacao de carreira.
- `frontend/src/services/finalEvaluations.ts`: tipo `AIInsights` e persistencia de `ai_insights` na tabela `final_evaluations`.
- `final_evaluations_migration.sql`: schema da tabela de avaliacoes finais, incluindo a coluna `ai_insights`.

### 1.2 Documentacao de integracoes de IA e engenharia de prompt

Documento entregue:

- `docs/AI_INTEGRATIONS_AND_PROMPTS.md`

Ele descreve a API de IA utilizada, o contexto de uso, o fluxo tecnico, o prompt principal, a estrutura de resposta exigida, validacoes, limites e revisao humana.

### 1.3 Documentacao e guia de implantacao

Documentos entregues:

- `README.md`
- `SUPABASE_SETUP.md`
- `docs/DEPLOYMENT_GUIDE.md`

Eles cobrem instalacao, variaveis de ambiente, execucao local, configuracao do Supabase, migrations, chaves de IA e orientacoes de publicacao.

### 1.4 Versao final do repositorio de prompts com rastreabilidade

Repositorio do projeto:

- https://github.com/Vinigg/feedback-project

Os prompts e ajustes de IA estao versionados no proprio GitHub, principalmente em:

- `backend/src/services/gemini.service.ts`
- `docs/AI_INTEGRATIONS_AND_PROMPTS.md`
- `docs/PROMPT_FAILURE_EXAMPLES.md`

A rastreabilidade das mudancas pode ser verificada pelo historico de commits do repositorio.

### 1.5 Exemplos de prompts que falharam

Documento entregue:

- `docs/PROMPT_FAILURE_EXAMPLES.md`

O arquivo contem dois exemplos objetivos:

- Resposta com markdown/texto fora do JSON.
- Recomendacoes e notas genericas sem ancoragem nos feedbacks reais.

Tambem descreve como o prompt foi ajustado e como a equipe validou o output.

## Resumo da entrega

O MVP final possui uma camada de IA aplicada ao fluxo mais critico do sistema: a consolidacao semestral de desempenho. A IA nao substitui a avaliacao humana; ela organiza evidencias, sugere notas, resume pontos tecnicos e comportamentais e gera recomendacoes que passam por revisao e aprovacao antes da publicacao para o colaborador.
