# Raomeo Management Mobile

React Native mobile app for Raomeo Management, built with Expo.

## Included Views

- Dashboard and operational quick actions
- Unified booking calendar timeline
- Rooms, reservations, guests, billing, F&B, housekeeping, maintenance, and front desk module lists
- ParetoSearch across hotel records

## Run Locally

Start the API stack from the repository root:

```bash
docker compose up -d
```

Then run the mobile app:

```bash
cd mobile
cp .env.example .env
npm install
npm run start
```

API URL defaults:

- Android emulator: `http://10.0.2.2:3000/api/v1`
- iOS simulator: set `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1`
- Physical device: set `EXPO_PUBLIC_API_BASE_URL=http://YOUR_LAN_IP:3000/api/v1`

Seed login:

- Email: `admin@raomeo.test`
- Password: `password123`
