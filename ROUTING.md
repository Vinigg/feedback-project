# Estrutura de Roteamento - Sistema de Gestão de Feedbacks

## Visão Geral

Este projeto implementa um sistema completo de roteamento usando `react-router-dom` v6 com proteção adequada de autenticação e padrões de arquitetura limpa.

## Estrutura de Arquivos

```
src/
  ├── pages/
  │   ├── Login.tsx              # Rota pública
  │   ├── Dashboard.tsx          # Rota protegida
  │   ├── Feedbacks.tsx          # Rota protegida
  │   ├── CreateFeedback.tsx     # Rota protegida
  │   ├── FeedbackDetails.tsx    # Rota protegida (com parâmetro ID)
  │   └── Profile.tsx            # Rota protegida
  │
  ├── routes/
  │   ├── PrivateRoute.tsx       # Componente protetor de rotas
  │   └── index.ts               # Constantes de rotas e exportações
  │
  ├── services/
  │   └── auth.service.ts        # Chamadas de API de autenticação
  │
  ├── types/
  │   └── auth.types.ts          # Definições de tipos TypeScript
  │
  └── App.tsx                    # Configuração principal de rotas
```

## Mapeamento de Rotas

### Rotas Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/login` | Login | Página de autenticação do usuário |

### Rotas Protegidas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/dashboard` | Dashboard | Visão geral e estatísticas |
| `/feedbacks` | Feedbacks | Lista de todos os feedbacks |
| `/feedbacks/create` | CreateFeedback | Formulário para criar novo feedback |
| `/feedbacks/:id` | FeedbackDetails | Visualização detalhada de um feedback |
| `/profile` | Profile | Gerenciamento do perfil do usuário |
| `/` | — | Redireciona para `/dashboard` |

## Implementação de Rotas Protegidas

### Componente PrivateRoute

O componente `PrivateRoute` atua como um protetor que:

1. **Verifica Autenticação**: Valida se existe um token em `localStorage`
2. **Permite Acesso**: Se token existe, renderiza o componente filho
3. **Redireciona**: Se sem token, redireciona para `/login`

```tsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### Como Funciona a Autenticação

1. Usuário faz login via `/login`
2. Backend valida credenciais e retorna um token JWT
3. Frontend armazena token em `localStorage`
4. Em visitas subsequentes, `PrivateRoute` verifica o token
5. Rotas protegidas são renderizadas apenas se token existe

## Usando Constantes de Rotas

Importe caminhos de rotas do índice centralizado:

```tsx
import { ROUTES } from './routes';

// Uso em navegação
navigate(ROUTES.DASHBOARD);
navigate(ROUTES.FEEDBACKS);
navigate(`/feedbacks/${feedbackId}`);
```

## Definições de Tipos

### auth.types.ts

```tsx
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: { name: string; email: string };
  token?: string;
  message?: string;
}

export class AuthError extends Error {
  constructor(message: string);
}
```

## Fluxo de Autenticação

```
Entrada do Usuário
    ↓
Página de Login (loginRequest)
    ↓
API do Backend (/api/auth/login)
    ↓
Validação
    ↓
Resposta com Token
    ↓
Armazenar em localStorage
    ↓
Redirecionar para /dashboard
    ↓
PrivateRoute verifica token
    ↓
Renderizar Componente Protegido
```

## Melhores Práticas Implementadas

✅ **Arquitetura Limpa**: Separação de responsabilidades (rotas, páginas, serviços, tipos)
✅ **Segurança de Tipo**: Tipagem TypeScript completa
✅ **Tratamento de Erros**: Classes de erro personalizadas
✅ **Organização**: Constantes de rotas centralizadas
✅ **Autenticação**: Token baseado em localStorage
✅ **Experiência**: Redirecionamento automático quando não autenticado
✅ **Escalabilidade**: Fácil adicionar novas rotas e páginas

## Adicionando Novas Rotas Protegidas

1. Crie novo componente de página em `src/pages/`
2. Importe em `App.tsx`
3. Adicione nova `<Route>` com wrapper `<PrivateRoute>`
4. (Opcional) Adicione constante de rota em `src/routes/index.ts`

Exemplo:

```tsx
<Route
  path="/new-feature"
  element={
    <PrivateRoute>
      <NewFeature />
    </PrivateRoute>
  }
/>
```

## Testando Autenticação

**Credenciais de Teste:**
- Email: `admin@email.com`
- Password: `123456`

O backend usa autenticação mock, então essas credenciais sempre funcionarão para testes.

## Configuração do Ambiente

1. **Backend**: Roda em `http://localhost:3000`
2. **Frontend**: Roda em `http://localhost:5173`
3. **Endpoint da API**: `http://localhost:3000/api/auth/login`

Certifique-se de que tanto frontend quanto backend estão rodando para funcionalidade completa.
