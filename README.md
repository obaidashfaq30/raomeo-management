# Raomeo Management

Raomeo Management is a full-stack hotel management monorepo with a Rails API backend, React dashboard frontend, PostgreSQL, JWT authentication, role-based access control, Sidekiq-ready background jobs, RSpec, Swagger/OpenAPI, and Docker Compose.

## Structure

- `backend/` Ruby on Rails API, PostgreSQL schema, service objects, jobs, RSpec, OpenAPI docs
- `frontend/` React, React Router, Zustand, Axios, TailwindCSS, Recharts
- `mobile/` React Native app built with Expo, React Navigation, Zustand, Axios
- `docker-compose.yml` PostgreSQL, Redis, Rails API, Sidekiq, React dev server
- `.github/workflows/ci.yml` backend and frontend CI checks

## Local Docker Setup

Use this path for normal local development. You do not need local Ruby, Rails, Node, PostgreSQL, or Redis installed; Docker Compose runs the full stack.

### Prerequisites

- Docker Engine or Docker Desktop
- Docker Compose v2
- Git

### First-Time Setup

```bash
git clone git@github.com:obaidashfaq30/raomeo-management.git
cd raomeo-management

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose build
docker compose run --rm backend ./bin/rails db:prepare
docker compose up -d
```

Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api/v1/health`
- Swagger UI: `http://localhost:3000/api-docs`

Seed login:

- Email: `admin@raomeo.test`
- Password: `password123`

### Daily Development

Start the stack:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f backend frontend sidekiq
```

Stop the stack:

```bash
docker compose down
```

Run backend tests in Docker:

```bash
docker compose run --rm -e RAILS_ENV=test backend bundle exec rails db:prepare
docker compose run --rm -e RAILS_ENV=test backend bundle exec rspec
```

Build the frontend in Docker:

```bash
docker compose run --rm frontend npm run build
```

Reset the local Docker database and seed data:

```bash
docker compose down -v
docker compose run --rm backend ./bin/rails db:prepare
docker compose up -d
```

### Docker Services

- `backend`: Rails API on `http://localhost:3000`
- `frontend`: React dev server on `http://localhost:5173`
- `db`: PostgreSQL, private to the Docker network
- `redis`: Redis, private to the Docker network
- `sidekiq`: background worker

PostgreSQL and Redis are intentionally not published on host ports, so they will not conflict with local services already using `5432` or `6379`.

## Roles

The backend supports `admin`, `front_desk`, `housekeeping`, `accountant`, and `manager`. Protected Rails controllers call `authorize_roles!` before privileged actions, and the frontend persists the authenticated user with Zustand.

## Main API Modules

- `POST /api/v1/auth/login`
- `GET /api/v1/rooms`
- `GET /api/v1/room_categories`
- `GET|POST /api/v1/reservations`
- `POST /api/v1/check_ins`
- `POST /api/v1/check_outs`
- `GET /api/v1/front_desk/live_status`
- `GET|POST /api/v1/housekeeping_tasks`
- `GET|POST /api/v1/maintenance_tickets`
- `GET|POST /api/v1/invoices`
- `POST /api/v1/invoices/:id/refund`
- `GET|POST /api/v1/food_beverage_orders`
- `GET /api/v1/guests`
- `GET /api/v1/pareto_search`
- `GET /api/v1/reports/occupancy`
- `GET /api/v1/reports/revenue`
- `GET /api/v1/reports/booking_trends`

## Optional Native Backend Development

```bash
cd backend
bundle install
bin/rails db:prepare db:seed
bin/rails server
bundle exec rspec
```

The Rails API uses service objects under `app/services` for reservations, check-in, check-out, billing, search, audit logging, and reporting. Search indexing is modeled with `SearchIndex` and updated through `SearchIndexJob`.

## Optional Native Frontend Development

```bash
cd frontend
npm install
npm run dev
npm run build
```

Set `VITE_API_BASE_URL` in `frontend/.env` when the API is not running on `http://localhost:3000/api/v1`.

## Mobile App Development

The mobile app lives in `mobile/` and uses Expo.

Start the API stack first:

```bash
docker compose up -d
```

Run the mobile app:

```bash
cd mobile
cp .env.example .env
npm install
npm run start
```

API URL notes:

- Android emulator uses `http://10.0.2.2:3000/api/v1` by default.
- iOS simulator can use `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1`.
- Physical devices need your computer LAN IP, for example `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:3000/api/v1`.

## Scaling Notes

- Room and reservation queries include status/date/category indexes for 1000-room inventory.
- Background work is Sidekiq-ready with Redis and separate `search` and `reports` queues.
- Audit logs capture actor, action, target record, request id, IP, and metadata.
- API versioning starts at `/api/v1`.
- Docker Compose mirrors the local service boundaries used in CI and production builds.
