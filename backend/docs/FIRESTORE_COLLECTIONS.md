# Rancangan NoSQL Firestore

Firestore digunakan untuk data yang perlu realtime atau semi-realtime.

## 1. realtime_locations

```json
{
  "volunteer_id": 1,
  "name": "Relawan Demo",
  "latitude": -7.8879,
  "longitude": 110.3289,
  "status": "available",
  "updated_at": "timestamp"
}
```

## 2. emergency_broadcasts

```json
{
  "title": "Butuh Relawan Medis",
  "location": "Bantul, Yogyakarta",
  "need": "10 relawan medis dan 5 relawan logistik",
  "priority": "high",
  "disaster_id": 1,
  "created_by": 1,
  "created_at": "timestamp"
}
```

## 3. quick_assignment_status

```json
{
  "assignment_id": 1,
  "volunteer_id": 1,
  "status": "on_the_way",
  "notes": "Relawan sedang menuju lokasi",
  "updated_at": "timestamp"
}
```

## 4. field_updates

```json
{
  "disaster_id": 1,
  "volunteer_id": 1,
  "message": "Butuh tambahan makanan siap saji",
  "condition": "urgent",
  "latitude": -7.8879,
  "longitude": 110.3289,
  "created_at": "timestamp"
}
```

## 5. coordination_chats

Struktur:

```txt
coordination_chats/{roomId}/messages/{messageId}
```

Contoh message:

```json
{
  "sender_id": 1,
  "sender_name": "Admin BNPB",
  "message": "Tim medis segera menuju lokasi.",
  "created_at": "timestamp"
}
```
