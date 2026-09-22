# tumar.tech

Public personal site and engineering / research portfolio for [tumar.tech](https://tumar.tech).

The current featured work is an HFT pet project on BTC-USDT perpetual market microstructure. The app is structured so later Data, ML and engineering projects can be added without changing the layout or API boundaries.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ESLint
- Docker

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Environment variables

Copy `.env.example` and adjust values as needed.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for SEO metadata |
| `NEXT_PUBLIC_GITHUB_URL` | Public GitHub profile or repository |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional LinkedIn profile. Leave empty to hide the footer link |
| `NEXT_PUBLIC_API_BASE_URL` | Future realtime / research API. Not used by pages yet |
| `NEXT_PUBLIC_SUPERSET_PUBLIC_URL` | Optional public/read-only Superset dashboard. Leave empty to hide the Live page button |

## Docker build

```bash
docker build -t tumar-web .
```

## Docker run

```bash
docker run --rm -p 3000:3000 tumar-web
```

The container listens on `0.0.0.0:3000`.

Health check:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{"status":"ok"}
```

## Production (tumar-ops)

The live site is deployed from the sibling `tumar-ops` repo via Traefik:

```bash
docker compose -f docker/docker-compose.web.yaml --env-file .env up -d --build
```

`NEXT_PUBLIC_*` values are baked in at image build time. After changing them, rebuild the image.
