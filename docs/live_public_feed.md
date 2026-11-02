# Live public feed (demo executor)

`/projects/hft/live` показывает **demo** исполнение random baseline как control strategy.

## Источник данных

- Timescale schema `okx_exec` (runs, signals, orders, fills, trade_results, positions).
- Подключение только через runtime env `HFT_DATABASE_URL` (read-only роль).
- Control API executor (`:8080`) **не** используется сайтом.

## Поведение

| Условие | Результат |
|---------|-----------|
| `HFT_DATABASE_URL` задан и БД отвечает | Live cards, PnL, recent trades/orders |
| URL нет или ошибка запроса | Fallback на mock + пометка на странице |

API: `GET /api/public/hft/live` → `{ source, error, dashboard, generatedAt }`.

## Масштабирование

Второй субсчёт / модель: отдельный `HFT_PUBLIC_STRATEGY` / фильтр по `extra_json` account label, либо расширение dashboard builder на несколько strategy rows в таблице Active strategies.
