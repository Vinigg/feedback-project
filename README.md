# [Projeto de feedback] – Gestão de Desempenho 🚀

Este projeto foi desenvolvido como parte da **Residência Tecnológica do Programa Embarque Digital (2º Período)**, em parceria com a empresa **Mesa Tech**. O sistema foi projetado para otimizar o processo de avaliação de desempenho através de ciclos mensais de registro de fatos e uma consolidação semestral de resultados.

## 📌 Sobre o Projeto
O sistema visa eliminar a subjetividade nas avaliações tradicionais. Através de interfaces segmentadas, líderes técnicos e comportamentais realizam registros mensais de pontos positivos e de atenção, que culminam em uma nota consolidada a cada seis meses, com peso equilibrado (50% técnica / 50% comportamental).

## 👥 Equipe de Desenvolvimento
*   [Pedro Pessoa de Albuquerque Neto](https://github.com/Ppan-droid)
*   [Roberto Henrique Cavalcanti Freitas](https://github.com/Roberto-Cavalcanti)
*   [Saulo Eduardo Almeida dos Santos](https://github.com/Saulo1Almeida)
*   [Thayna Verçosa de Andrade](https://github.com/thaynavercosa)
*   [Thiago Cardozo da Conceição](https://github.com/thcardozo)
*   [Vinícius Pessoa de Albuquerque](https://github.com/Vini-palb)
*   [Vinícius Wagner Gomes Germano](https://github.com/Vinigg)
*   [Vitória Gabrielly Gomes da Silva](https://github.com/Vitoria-Gabrielly-DEV)
*   [Wesley Yuri da Silva](https://github.com/wesleysilva77)
*   [Yasmin Karolina Silva de Moura Godinho](https://github.com/Yasmink-godinho)

## 👤 Perfis de Usuário e Funcionalidades
*   **Administrador (ADM):** Responsável pelo gerenciamento de cargos, usuários e configuração das perguntas de avaliação.
*   **Líder Técnico:** Focado na performance técnica, avaliando entregas e mentoria.
*   **Líder Comportamental:** Focado em soft skills, analisando comunicação, proatividade e colaboração.
*   **Funcionário:** Visualiza o índice geral de desempenho e o feedback consolidado ao final de cada semestre.

## 🚀 Épicos do Sistema
1.  **Administração de Usuários e Permissões:** Controle rigoroso de acessos por perfil.
2.  **Gestão de Projetos e Alocação:** Associação de colaboradores a projetos e lideranças.
3.  **Registro Contínuo de Feedbacks:** Coleta mensal de destaques e pontos de atenção.
4.  **Avaliação Técnica e Comportamental:** Segmentação das competências por área de atuação.
5.  **Acompanhamento Histórico:** Registro evolutivo para análise de crescimento do colaborador.
6.  **Consolidação de Avaliações:** Cálculo automatizado do índice geral semestral.
7.  **Visualização Analítica (Dashboards):** Dashboards intuitivos para suporte à tomada de decisão.
8.  **Segurança e Controle:** Restrição de visualização entre líderes técnicos e comportamentais.

## 🎨 Design e Prototipagem
O fluxo e a interface do sistema foram desenvolvidos com foco em usabilidade e responsividade (Mobile e Desktop).
[**Acesse o protótipo interativo no Figma aqui**](https://www.figma.com/make/6XSHvHX2bEu2LWvidXsWxZ/Sistema-de-Gest%C3%A3o-de-Feedbacks?t=oGW0ne3WxuvY8mes-20&fullscreen=1)

## 🧰 Ferramentas Utilizadas
*   **Figma:** Design de UI/UX e prototipagem de alta fidelidade.
*   **Figma Make (AI):** Refinamento de fluxos e componentes.
*   **Metodologias Ágeis:** Divisão de tarefas baseada em Épicos e Histórias de Usuário.

---

**Nota:** Este repositório é fruto de um desafio real de mercado, unindo teoria acadêmica e prática profissional na área de Análise e Desenvolvimento de Sistemas.

## Entrega final AI-Powered

Os documentos principais da entrega final estao organizados em:

*   **ENTREGA_FINAL_MVP_AI_POWERED.md:** checklist da entrega solicitada pela residencia.
*   **docs/AI_INTEGRATIONS_AND_PROMPTS.md:** integracao Gemini, contexto de uso, prompt principal e contrato de resposta.
*   **docs/DEPLOYMENT_GUIDE.md:** guia de implantacao local/producao e variaveis de ambiente.
*   **docs/PROMPT_FAILURE_EXAMPLES.md:** exemplos de prompts que falharam e ajustes aplicados.

### Rodando o projeto

> **Primeira vez?** Se você nunca rodou este projeto antes, siga o guia completo em **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)**. Ele explica desde a instalação do Node.js até a publicação em produção.

**Pré-requisitos:** Node.js 18+ instalado ([baixe aqui](https://nodejs.org)).

**Configuração rápida** (para quem já tem o ambiente pronto):

1. No Supabase, execute no SQL Editor (nesta ordem):
   - `setup_database.sql` → cria tabelas e regras de segurança
   - `seed_demo_data.sql` → cria usuários de teste e dados de demonstração

2. Configure `frontend/.env` (use `frontend/.env.example` como base):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
VITE_BACKEND_URL=http://localhost:3000
```

3. Configure `backend/.env` (use `backend/.env.example` como base):

```env
GEMINI_API_KEY=sua-chave-gemini
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

4. Instale dependências e rode o projeto:

```bash
npm install
npm run dev
```

5. Faça login com `admin@empresa.com` / `Empresa@2026`

Frontend: `http://localhost:5173`
Backend: `http://localhost:3000`
