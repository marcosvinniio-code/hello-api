# Runbook — hello-api

Este documento reúne os procedimentos para verificar a saúde da aplicação, diagnosticar problemas e reverter uma versão com problema.

## Como verificar se a API está no ar

```bash
curl https://hello-api-phi.vercel.app/health
```

Se a API estiver saudável, a resposta deve ser um JSON com `"status": "ok"`. Um erro de conexão, timeout, ou uma resposta diferente de 200 indica problema.

## Como descobrir qual commit está em produção

O campo `commit` na resposta do `/health` mostra o SHA do commit publicado atualmente:

```bash
curl https://hello-api-phi.vercel.app/health
```

Copie o valor do campo `commit` e pesquise por ele no histórico do GitHub, em:
`https://github.com/marcosvinniio-code/hello-api/commit/<SHA>`

Isso mostra exatamente qual mudança está no ar, quem a fez e o que foi alterado.

## O que fazer se `/health` falhar

1. Confirme que o problema é real, repetindo o `curl` uma segunda vez.
2. Acesse a aba **Actions** do repositório no GitHub e verifique se o último workflow `deploy-production.yml` terminou com sucesso (checkmark verde) ou falhou (X vermelho).
3. Se o workflow falhou, abra os logs do job `deploy-production` e identifique em qual step o erro ocorreu.
4. Acesse o painel da Vercel (aba **Deployments** do projeto) e confirme se o último deployment de produção está marcado como "Ready" ou apresenta erro.
5. Se necessário, siga o procedimento de rollback abaixo.

## Como fazer rollback

### Opção 1 — Rollback pelo painel da Vercel (mais rápido)

1. Acesse o painel da Vercel, aba **Deployments** do projeto `hello-api`.
2. Localize o deployment de produção anterior, que estava funcionando corretamente.
3. Clique nos três pontos ao lado desse deployment e selecione **Promote to Production**.
4. Confirme a ação. A URL de produção volta a apontar para essa versão anterior, imediatamente.

### Opção 2 — Rollback via Git (reverte a origem do problema)

1. Identifique o commit problemático (usando o SHA do `/health`, como descrito acima).
2. Reverta o commit na `main`:

```bash
git checkout main
git pull origin main
git revert <SHA-do-commit-problematico>
git push origin main
```

3. O push na `main` dispara automaticamente o `deploy-production.yml`, publicando a versão revertida.

> A Opção 1 é mais rápida para conter o problema imediatamente. A Opção 2 corrige a origem, mantendo o histórico do Git consistente, e deve ser feita mesmo depois de usar a Opção 1, para que o código da `main` reflita a versão realmente publicada.

## Onde ver logs

- **Logs do pipeline (build e deploy)**: aba **Actions** do repositório GitHub.
- **Logs de execução da aplicação (runtime)**: painel da Vercel, aba **Logs** do projeto (ou dentro de cada deployment específico).
