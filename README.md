# Backend API (Express + SQLite)

## Setup

1. Create `.env` from example:

```bash
cp .env.example .env
```

2. Install deps:

```bash
npm install
```

3. Run dev:

```bash
npm run dev
```

API on `http://localhost:4000`.

## Endpoints

- Customers: `GET/POST/PUT/DELETE /api/customers`
- Tables: `GET/POST/PUT/DELETE /api/tables`
- Floor positions: `GET/POST/DELETE /api/floor-positions`
- Reservations: `GET(range)/POST/PUT/DELETE /api/reservations`
  - Range: `GET /api/reservations?start=ISO&end=ISO`
- Calendar: `GET /api/calendar?start=ISO&end=ISO`
- Waitlist: `GET/POST/PUT/DELETE /api/waitlist`

## Notas
- Capa de datos desacoplada via repositorios.
- SQLite ahora, preparado para adaptar a Supabase (reemplazar `withDatabase`).
