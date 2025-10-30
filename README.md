# Mini-ERP (Usuários, Clientes, Produtos) + Login

Sistema em **Node.js + Express + Prisma + PostgreSQL + EJS**.

## Pré-requisitos
- Node.js 20+
- Conta grátis no Neon (PostgreSQL) e Render.com

## Setup local
```bash
cp .env.example .env        # edite DATABASE_URL e SESSION_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
Acesse http://localhost:3000/login  
Usuário: `admin@mini-erp.local`  Senha: `admin123`

## Deploy (Render + Neon)
- Crie DB no Neon e copie `DATABASE_URL` (com `sslmode=require`).
- No Render, novo Web Service com seu repositório:
  - Build Command: `npm install && npx prisma generate && npm run build`
  - Start Command: `node dist/server.js`
  - Variáveis: `DATABASE_URL`, `SESSION_SECRET`, `PORT` (opcional)
- Depois do primeiro deploy, rode migrações (via Shell ou CI):
  - `npx prisma migrate deploy && node dist/prisma/seed.js` (ou `npm run seed` usando `tsx` em ambiente com source)

## Rotas principais (todas protegidas por login)
- `/` Dashboard
- `/clients` (listar, buscar) | `/clients/new` | `/clients/:id/edit` | `/clients/:id/delete`
- `/products` (listar, buscar) | `/products/new` | `/products/:id/edit` | `/products/:id/delete`
- `/users` (ADMIN) | `/users/new` | `/users/:id/edit` | `/users/:id/delete`

## Login
- POST `/login` autentica com `bcrypt.compare`, cria `req.session.user`.
- `ensureAuth` bloqueia rotas privadas; `ensureAdmin` restringe `/users/*`.

Boa apresentação! Entregue a **URL pública** até 06/11.
