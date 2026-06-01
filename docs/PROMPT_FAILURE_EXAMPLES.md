# Exemplos de Prompts que Falharam

Este documento resume dois problemas encontrados ou previstos durante a evolucao da integracao de IA do MVP e os ajustes aplicados no prompt/backend.

## Exemplo 1: resposta fora do formato JSON

### Prompt/saida problematica

Em versoes iniciais, uma instrucao mais aberta pedia ao modelo apenas para "gerar insights consolidados" sobre os feedbacks. O modelo podia responder com texto explicativo, markdown e bloco de codigo:

~~~text
Claro! Aqui esta a analise:

```json
{
  "positive_evolution": [...]
}
```
~~~

Essa resposta e legivel para uma pessoa, mas quebra o fluxo tecnico quando o backend tenta salvar os insights como objeto estruturado.

### Ajuste aplicado

O prompt passou a exigir explicitamente:

```text
IMPORTANTE: Retorne APENAS o JSON valido, sem markdown, sem codigo delimitador, sem texto adicional.
```

O backend tambem passou a remover delimitadores de markdown antes do `JSON.parse`, como camada extra de tolerancia:

```ts
const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
```

### Validacao

A equipe validou chamando a geracao pela tela de avaliacao final e conferindo se:

- A resposta voltava sem erro de parse.
- O painel de insights era exibido.
- Notas, resumos e recomendacao eram preenchidos no formulario.

## Exemplo 2: notas e recomendacoes genericas

### Prompt/saida problematica

Quando o prompt nao separava claramente feedbacks tecnicos e comportamentais, o modelo tendia a produzir uma avaliacao generica, com notas medianas e justificativas pouco ligadas aos registros reais.

```json
{
  "score_suggestions": {
    "technical": { "Qualidade": 4, "Desempenho": 4 },
    "behavioral": { "Comunicacao": 4, "Proatividade": 4 }
  },
  "career_recommendation": "permanencia"
}
```

O problema era que a saida parecia razoavel, mas nao evidenciava quais feedbacks sustentavam as sugestoes.

### Ajuste aplicado

O backend passou a:

- Separar feedbacks por `evaluation_type`.
- Informar a quantidade de registros tecnicos e comportamentais.
- Enviar o periodo de cada feedback.
- Exigir campos especificos como `positive_evolution`, `recurring_issues` e `trends`.
- Limitar a recomendacao de carreira a valores controlados.

Trecho do prompt atual:

```text
FEEDBACKS TECNICOS (... registros):
...

FEEDBACKS COMPORTAMENTAIS (... registros):
...

Baseado nesses dados, retorne um JSON com exatamente esta estrutura...
```

### Validacao

A validacao foi feita comparando os insights gerados com os feedbacks recorrentes do colaborador no semestre selecionado. O resultado esperado era:

- Pontos positivos e problemas recorrentes coerentes com os textos registrados.
- Sugestoes de nota dentro da escala 1 a 5.
- Resumos editaveis pelo lider.
- Recomendacao final revisada antes do envio para aprovacao.

## Conclusao

Os ajustes melhoraram a previsibilidade da integracao e reduziram falhas comuns de LLM em sistemas de producao: resposta sem formato estruturado, recomendacoes genericas e valores fora do contrato esperado pela aplicacao.
