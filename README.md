# hello-api

API simples em Node.js, criada como desafio prático de CI/CD, com deploy automatizado na Vercel.

## Como rodar localmente

```bash
git clone git@github.com:marcosvinniio-code/hello-api.git
cd hello-api
npm install
```

Para rodar o servidor localmente:

```bash
vercel dev
```

> Nota: não existe script `dev` no `package.json` — veja a seção "Decisões técnicas" para entender o motivo.

## Variáveis de ambiente

| Nome         | Obrigatória | Padrão (fallback) | Descrição                                               |
| ------------ | ----------- | ----------------- | ------------------------------------------------------- |
| `COMMIT_SHA` | Não         | `local`           | SHA do commit publicado                                 |
| `VERCEL_ENV` | Não         | `development`     | Ambiente de execução (production, preview, development) |

## Endpoints

### `GET /`

Retorna uma saudação simples em texto puro.

```bash
curl https://hello-api-phi.vercel.app/
```

Resposta: `Hello, World!` (status 200)

### `GET /health`

Retorna o status de saúde da aplicação em JSON.

```bash
curl https://hello-api-phi.vercel.app/health
```

Resposta:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "commit": "a3f9c2e...",
  "timestamp": "2026-08-19T16:13:28.179Z",
  "environment": "production"
}
```

### Rotas desconhecidas

Qualquer rota não mapeada retorna 404.

### Métodos não permitidos

Qualquer método diferente de `GET` retorna 405, com o header `Allow: GET`.

## Fluxo de desenvolvimento (PR → CI → preview → merge → produção)

1. Uma branch nova é criada a partir da `main` atualizada.
2. Um Pull Request é aberto contra a `main`.
3. O workflow `ci.yml` roda automaticamente: lint, verificação de formatação e testes.
4. O workflow `deploy-preview.yml` publica uma versão de teste e comenta a URL no próprio PR.
5. Após revisão e aprovação, o PR é mergeado (squash and merge) na `main`.
6. O merge dispara automaticamente o `deploy-production.yml`, que publica a versão definitiva, propagando o SHA do commit para o campo `commit` do `/health`.

## Decisões técnicas

- **Repositório público**: no plano gratuito do GitHub, regras de proteção de branch só são aplicadas de verdade em repositórios públicos. Como o objetivo do desafio é demonstrar um fluxo de CI/CD com proteção real, o repositório foi mantido público deliberadamente.
- **Sem Express**: o projeto é pequeno o suficiente para usar o handler nativo da Vercel, evitando uma dependência externa desnecessária e reduzindo a superfície de risco.
- **Sem script `dev` no `package.json`**: o script `vercel dev` causava um loop recursivo ao ser invocado via `npm run dev`. O comando `vercel dev` deve ser usado diretamente no terminal para desenvolvimento local.
