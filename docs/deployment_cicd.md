# CI/CD: tumar-web

Цепочка при push в `main`:

```text
CI (lint, build, typecheck, docker smoke) → образ в GHCR → Approve (production) → SSH на ops → retag → compose up tumar-web
```

Workflow:

- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — PR и push в `develop`; на `main` вызывается из деплоя.
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) — сборка и деплой.

Образ в GHCR: `ghcr.io/sorokad/tumar-web:<sha>` (имя = GitHub repository `tumar-web`).
На сервере образ перетегируется в `tumar-web:latest` — так ожидает compose в tumar-ops.
Compose сайта живёт в **tumar-ops** (`docker/docker-compose.web.yaml`); этот репозиторий на сервере не клонируется для деплоя сайта.

`NEXT_PUBLIC_*` вшиваются при сборке образа (Actions **Variables**). После смены — новый деплой.

---

## Секреты и variables

| Имя | Где | Назначение |
|-----|-----|------------|
| `VPS_SSH_HOST` | secret | IP ops-сервера |
| `VPS_SSH_USER` | secret | `okx-hft-ops` |
| `VPS_SSH_PRIVATE_KEY` | secret | deploy-ключ |
| `VPS_DEPLOY_PATH` | secret | `/opt/hft/okx-hft-ops` |
| `NEXT_PUBLIC_*` | variables | публичные URL/ключи для Next.js |

На **ops** в `.env` (runtime контейнера `tumar-web`, не в GitHub Actions build):

| Имя | Назначение |
|-----|------------|
| `HFT_DATABASE_URL` | read-only URL в Timescale/PgBouncer для Live journal (`okx_exec`) |
| `HFT_PUBLIC_STRATEGY` | фильтр стратегии (default `random_baseline_v1`) |
| `HFT_PUBLIC_INST_ID` | фильтр инструмента (default `BTC-USDT-SWAP`) |

Без `HFT_DATABASE_URL` страница `/projects/hft/live` показывает локальные mock-данные.

Пример роли (выполнить на сервере БД от суперпользователя, пароль не коммитить):

```sql
CREATE ROLE tumar_web_ro LOGIN PASSWORD '...';
GRANT CONNECT ON DATABASE okx_hft TO tumar_web_ro;
GRANT USAGE ON SCHEMA okx_exec TO tumar_web_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA okx_exec TO tumar_web_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA okx_exec GRANT SELECT ON TABLES TO tumar_web_ro;
```

Публичный JSON: `GET /api/public/hft/live`.

Environment `production`: Required reviewers, без admin bypass; Deployment branches → `main`.

---

## Что делает деплой

1. CI + push образа в GHCR.
2. SSH на ops → `docker login ghcr.io` временным токеном.
3. `docker pull` → `docker tag … tumar-web:latest`.
4. `docker compose -f docker/docker-compose.web.yaml --env-file .env up -d --no-deps --no-build --force-recreate --wait tumar-web`.

Не использовать `docker compose … --build` на проде — образ приходит из GHCR.
