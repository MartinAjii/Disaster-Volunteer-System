# Disaster Volunteer System - Merged Backend Version

Perubahan yang sudah dilakukan:

1. Folder `auth-service`, `disaster-service`, dan `realtime-service` digabung menjadi satu folder:
   ```txt
   backend/
   ```

2. Backend sekarang memakai satu server:
   ```txt
   http://localhost:3000
   ```

3. Frontend React diarahkan ke satu backend URL melalui:
   ```txt
   VITE_API_URL=http://localhost:3000
   ```

4. SQL MySQL dilengkapi menjadi 7 tabel:
   - users
   - volunteers
   - shelters
   - disasters
   - assignments
   - reports
   - volunteer_status_logs

5. NoSQL Firestore ditambahkan dengan 5 collection:
   - realtime_locations
   - emergency_broadcasts
   - quick_assignment_status
   - field_updates
   - coordination_chats

6. Fitur yang ditambahkan:
   - lokasi relawan realtime
   - pencarian relawan terdekat
   - broadcast kebutuhan darurat
   - update status penugasan cepat
   - update lapangan
   - chat koordinasi
   - laporan BNPB/lapangan
   - status ketersediaan relawan
   - Cloud Storage opsional untuk foto laporan

7. Backend sudah memiliki satu `Dockerfile` dan `cloudbuild.yaml` untuk deploy Cloud Run.
