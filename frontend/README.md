# Vino Costero — Demo Local (sin Docker, sin Auth)

## Backend (Express + Prisma SQLite)
1) Configura variables:
```bash
cd backend
cp .env.example .env
```
2) Instala y prepara DB:
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
# => http://localhost:4000/health
```

## Frontend (React + Vite)
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
# => http://localhost:5173
```

## Notas
- DB es SQLite (`backend/prisma/dev.db`) para evitar instalar MySQL hoy.
- Endpoints: /api/parcels, /api/grapes, /api/diseases, /api/plantings, /api/harvests, /api/indicators/harvest-readiness/:plantingId
- Mañana puedes cambiar a MySQL cambiando `provider` y `DATABASE_URL` en Prisma y ejecutando migraciones.
