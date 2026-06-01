# Documentacao de Integracoes de IA e Engenharia de Prompt

## Visao geral

O projeto usa IA para apoiar a criacao da avaliacao final semestral de um colaborador. A funcionalidade analisa feedbacks recorrentes registrados ao longo do periodo e gera evolucoes positivas, pontos de melhoria, sugestoes de notas, resumos tecnico/comportamental, tendencias e recomendacao de carreira.

A IA funciona como apoio a decisao. O lider ainda pode revisar, editar, salvar rascunho e enviar a avaliacao para aprovacao.

## API/modelo utilizado

- Provedor: Google Gemini.
- SDK: `@google/generative-ai`.
- Modelo padrao: `gemini-2.5-flash`.
- Chave: `GEMINI_API_KEY`.
- Modelo opcional: `GEMINI_MODEL`.

Implementacao principal: `backend/src/services/gemini.service.ts`.

## Fluxo tecnico

1. O usuario abre `frontend/src/pages/FinalEvaluationForm.tsx`.
2. Seleciona colaborador e semestre.
3. Clica em `Gerar Insights com IA`.
4. O frontend busca feedbacks recorrentes do colaborador no Supabase.
5. O frontend filtra os feedbacks pelo semestre selecionado.
6. O frontend envia os dados para `POST /api/ai/analyze-feedbacks`.
7. O backend valida `employee_name` e `feedbacks`.
8. O backend separa feedbacks tecnicos e comportamentais.
9. O backend monta o prompt e chama Gemini.
10. O backend exige JSON valido e retorna `insights`.
11. O frontend usa os insights para preencher sugestoes de notas, resumos e recomendacao.
12. Ao salvar, os insights ficam persistidos em `final_evaluations.ai_insights`.

Arquivos envolvidos:

- `frontend/src/pages/FinalEvaluationForm.tsx`
- `frontend/src/services/aiService.ts`
- `frontend/src/services/evaluations.ts`
- `frontend/src/services/finalEvaluations.ts`
- `backend/src/routes/ai.routes.ts`
- `backend/src/controllers/ai.controller.ts`
- `backend/src/services/gemini.service.ts`
- `final_evaluations_migration.sql`

## Entrada enviada para a IA

```json
{
  "employee_name": "Nome do colaborador",
  "feedbacks": [
    {
      "evaluation_type": "technical",
      "period": "2026-01",
      "answers": {
        "Qualidade": "Texto do feedback",
        "Desempenho": "Texto do feedback"
      }
    }
  ]
}
```

O backend transforma essa entrada em blocos de feedbacks tecnicos e comportamentais, preservando periodo e respostas originais.

## Prompt principal

O prompt atual esta em `backend/src/services/gemini.service.ts`. Ele instrui o modelo a atuar como especialista em gestao de pessoas e desenvolvimento de talentos:

```text
Voce e um especialista em gestao de pessoas e desenvolvimento de talentos.
Analise os feedbacks recorrentes abaixo do colaborador "${employeeName}" e gere insights consolidados para apoiar a construcao de uma avaliacao formal de desempenho semestral.

FEEDBACKS TECNICOS (${technicalFeedbacks.length} registros):
${technicalFeedbacks.length > 0 ? formatFeedbacks(technicalFeedbacks) : '(Nenhum feedback tecnico registrado)'}

FEEDBACKS COMPORTAMENTAIS (${behavioralFeedbacks.length} registros):
${behavioralFeedbacks.length > 0 ? formatFeedbacks(behavioralFeedbacks) : '(Nenhum feedback comportamental registrado)'}

Baseado nesses dados, retorne um JSON com exatamente esta estrutura:
{
  "positive_evolution": ["lista de competencias ou comportamentos com evolucao positiva observada"],
  "recurring_issues": ["lista de dificuldades ou pontos recorrentes de melhoria"],
  "score_suggestions": {
    "technical": {
      "Qualidade": <numero de 1 a 5>,
      "Desempenho": <numero de 1 a 5>,
      "Aprendizado": <numero de 1 a 5>,
      "Mentoria": <numero de 1 a 5>,
      "Arquitetura": <numero de 1 a 5>
    },
    "behavioral": {
      "Comunicacao": <numero de 1 a 5>,
      "Proatividade": <numero de 1 a 5>,
      "Colaboracao": <numero de 1 a 5>,
      "Iniciativa": <numero de 1 a 5>,
      "Lideranca": <numero de 1 a 5>
    }
  },
  "technical_summary": "resumo tecnico do periodo em 3 a 4 frases",
  "behavioral_summary": "resumo comportamental do periodo em 3 a 4 frases",
  "trends": ["lista de tendencias percebidas nos feedbacks ao longo do tempo"],
  "career_recommendation": "<uma das opcoes: efetivacao, promocao, permanencia, desligamento>"
}

IMPORTANTE: Retorne APENAS o JSON valido, sem markdown, sem codigo delimitador, sem texto adicional.
```

Observacao: no codigo-fonte os nomes de competencias usam acentos em portugues. O texto acima foi mantido sem acentos para evitar problemas de codificacao em ambientes diferentes.

## Saida esperada

```ts
export interface AIInsights {
  positive_evolution: string[];
  recurring_issues: string[];
  score_suggestions: {
    technical: Record<string, number>;
    behavioral: Record<string, number>;
  };
  technical_summary: string;
  behavioral_summary: string;
  trends: string[];
  career_recommendation: string;
}
```

## Validacoes e tratamento de erro

- A rota exige `employee_name` e `feedbacks` nao vazio.
- Se `GEMINI_API_KEY` nao estiver configurada, o backend retorna erro claro.
- Se a IA retornar JSON invalido, o backend retorna erro de resposta invalida.
- O backend remove delimitadores de bloco de codigo caso o modelo ainda tente responder com markdown.
- O frontend limita as notas sugeridas para o intervalo de 1 a 5 e arredonda valores numericos.
- A recomendacao de carreira so e aplicada se estiver entre `efetivacao`, `promocao`, `permanencia`, `desligamento`.

## Decisao humana e responsabilidade

A IA nao publica avaliacao automaticamente. O fluxo exige revisao do texto/notas, salvamento como rascunho, envio para aprovacao, aprovacao tecnica, aprovacao comportamental e aprovacao de RH/admin. Essa separacao mantem a IA como ferramenta de apoio.
