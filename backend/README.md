# Backend Disaster Volunteer System

Folder ini adalah hasil penggabungan:

- `auth-service`
- `disaster-service`
- `realtime-service`

menjadi satu service backend bernama `backend`.

Backend ini sudah ditambah kekurangan dari deskripsi project:

- SQL MySQL untuk data utama.
- Firestore NoSQL untuk realtime data.
- Tabel SQL lebih lengkap.
- Endpoint REST API lebih dari 15.
- Dockerfile satu backend.
- Cloud Run ready.
- Endpoint legacy agar frontend lama tetap bisa jalan.

## Menjalankan Backend Lokal

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run seed:admin
npm run dev
```

Backend berjalan di:

```txt
http://localhost:3000
```

Login admin default:

```txt
email: admin@bnpb.go.id
password: admin12345
```

## SQL Tables

Database MySQL memiliki 7 tabel:

1. `users`
2. `volunteers`
3. `shelters`
4. `disasters`
5. `assignments`
6. `reports`
7. `volunteer_status_logs`

## Firestore Collections

NoSQL Firestore dirancang memakai minimal 5 collection:

1. `realtime_locations`
2. `emergency_broadcasts`
3. `quick_assignment_status`
4. `field_updates`
5. `coordination_chats`

## Endpoint Utama

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
POST /api/auth/logout
```

Legacy route yang tetap didukung:

```txt
POST /register
POST /login
GET  /profile
PUT  /profile
```

### Volunteers

```txt
POST   /api/volunteers
GET    /api/volunteers
GET    /api/volunteers/:id
PUT    /api/volunteers/:id
PATCH  /api/volunteers/:id/availability
GET    /api/volunteers/:id/status-logs
DELETE /api/volunteers/:id
```

### Disasters

```txt
POST   /api/disasters
GET    /api/disasters
GET    /api/disasters/:id
PUT    /api/disasters/:id
DELETE /api/disasters/:id
```

### Shelters / Posko

```txt
POST   /api/shelters
GET    /api/shelters
GET    /api/shelters/:id
PUT    /api/shelters/:id
DELETE /api/shelters/:id
```

### Assignments / Penugasan

```txt
POST   /api/assignments
GET    /api/assignments
GET    /api/assignments/:id
PUT    /api/assignments/:id
PATCH  /api/assignments/:id/status
DELETE /api/assignments/:id
```

### Reports / Laporan BNPB

```txt
POST   /api/reports
GET    /api/reports
GET    /api/reports/:id
PUT    /api/reports/:id
DELETE /api/reports/:id
```

### Realtime NoSQL Firestore

```txt
POST   /api/realtime/locations/:volunteerId
GET    /api/realtime/locations
GET    /api/realtime/locations/nearby?lat=-7.88&lng=110.32&radiusKm=10
GET    /api/realtime/locations/:volunteerId
DELETE /api/realtime/locations/:volunteerId

POST   /api/realtime/broadcasts
GET    /api/realtime/broadcasts
DELETE /api/realtime/broadcasts/:id

POST   /api/realtime/assignment-status
GET    /api/realtime/assignment-status/:assignmentId

POST   /api/realtime/field-updates
GET    /api/realtime/field-updates/:disasterId

POST   /api/realtime/chats/:roomId/messages
GET    /api/realtime/chats/:roomId/messages
```

## Deploy Cloud Run

```bash
cd backend
gcloud builds submit --config cloudbuild.yaml
```

Atau manual:

```bash
docker build -t gcr.io/PROJECT_ID/disaster-volunteer-backend .
docker push gcr.io/PROJECT_ID/disaster-volunteer-backend

gcloud run deploy disaster-volunteer-backend \
  --image gcr.io/PROJECT_ID/disaster-volunteer-backend \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --port 3000
```
