const { pool } = require('../config/db');
const { getFirestore, serverTimestamp } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const { calculateDistanceKm } = require('../utils/distance');

function normalizeDoc(doc) {
  return {
    id: doc.id,
    ...doc.data()
  };
}

const updateLocation = asyncHandler(async (req, res) => {

  const db = getFirestore();

  const { volunteerId } =
    req.params;

  const {
    latitude,
    longitude,
    status = 'available'
  } = req.body;

  if (
    latitude === undefined ||
    longitude === undefined
  ) {

    return res.status(400).json({

      success: false,

      message:
        'Latitude dan longitude wajib diisi'
    });
  }

  // ambil data volunteer dari mysql
  const [rows] =
    await pool.execute(

      `SELECT full_name
       FROM volunteers
       WHERE user_id = ?`,

      [volunteerId]
    );

  const volunteer =
    rows[0];

  await db
    .collection(
      'realtime_locations'
    )
    .doc(String(volunteerId))
    .set({

      volunteer_id:
        Number(volunteerId),

      name:
        volunteer?.full_name ||
        'Relawan',

      latitude:
        Number(latitude),

      longitude:
        Number(longitude),

      status,

      updated_at:
        serverTimestamp()

    }, { merge: true });

  res.json({

    success: true,

    message:
      'Lokasi realtime relawan berhasil diperbarui'
  });
});

const getLocations = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const snapshot = await db.collection('realtime_locations').get();

  res.json({
    success: true,
    message: 'Data lokasi realtime berhasil diambil',
    data: snapshot.docs.map(normalizeDoc)
  });
});

const getLocationByVolunteer = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const doc = await db.collection('realtime_locations').doc(String(req.params.volunteerId)).get();

  if (!doc.exists) {
    return res.status(404).json({
      success: false,
      message: 'Lokasi relawan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Lokasi relawan berhasil diambil',
    data: normalizeDoc(doc)
  });
});

const deleteLocation = asyncHandler(async (req, res) => {
  const db = getFirestore();
  await db.collection('realtime_locations').doc(String(req.params.volunteerId)).delete();

  res.json({
    success: true,
    message: 'Lokasi relawan berhasil dihapus'
  });
});

const getNearbyVolunteers = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const { lat, lng, radiusKm = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Query lat dan lng wajib diisi'
    });
  }

  const centerLat = Number(lat);
  const centerLng = Number(lng);
  const radius = Number(radiusKm);

  const snapshot = await db.collection('realtime_locations').get();

  const data = snapshot.docs
    .map(normalizeDoc)
    .map(item => ({
      ...item,
      distance_km: calculateDistanceKm(
        centerLat,
        centerLng,
        Number(item.latitude),
        Number(item.longitude)
      )
    }))
    .filter(item => item.distance_km <= radius)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json({
    success: true,
    message: 'Relawan terdekat berhasil diambil',
    data
  });
});

const createBroadcast = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const {
    title,
    location,
    need,
    priority = 'medium',
    disaster_id = null
  } = req.body;

  if (!title || !location || !need) {
    return res.status(400).json({
      success: false,
      message: 'Judul, lokasi, dan kebutuhan wajib diisi'
    });
  }

  const docRef = await db.collection('emergency_broadcasts').add({
    title,
    location,
    need,
    priority,
    disaster_id,
    created_by: req.user ? req.user.id : null,
    created_at: serverTimestamp()
  });

  res.status(201).json({
    success: true,
    message: 'Broadcast kebutuhan darurat berhasil dibuat',
    data: {
      id: docRef.id
    }
  });
});

const getBroadcasts = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const snapshot = await db.collection('emergency_broadcasts').get();

  res.json({
    success: true,
    message: 'Data broadcast berhasil diambil',
    data: snapshot.docs.map(normalizeDoc)
  });
});

const deleteBroadcast = asyncHandler(async (req, res) => {
  const db = getFirestore();
  await db.collection('emergency_broadcasts').doc(req.params.id).delete();

  res.json({
    success: true,
    message: 'Broadcast berhasil dihapus'
  });
});

const updateQuickAssignmentStatus = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const {
    assignment_id,
    volunteer_id,
    status,
    notes = null
  } = req.body;

  if (!assignment_id || !volunteer_id || !status) {
    return res.status(400).json({
      success: false,
      message: 'Assignment ID, volunteer ID, dan status wajib diisi'
    });
  }

  await db.collection('quick_assignment_status').doc(String(assignment_id)).set({
    assignment_id: Number(assignment_id),
    volunteer_id: Number(volunteer_id),
    status,
    notes,
    updated_at: serverTimestamp()
  }, { merge: true });

  res.json({
    success: true,
    message: 'Status cepat penugasan berhasil diperbarui'
  });
});

const getQuickAssignmentStatus = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const doc = await db.collection('quick_assignment_status').doc(String(req.params.assignmentId)).get();

  if (!doc.exists) {
    return res.status(404).json({
      success: false,
      message: 'Status cepat penugasan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Status cepat penugasan berhasil diambil',
    data: normalizeDoc(doc)
  });
});

const createFieldUpdate = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const {
    disaster_id,
    volunteer_id,
    message,
    condition = null,
    latitude = null,
    longitude = null
  } = req.body;

  if (!disaster_id || !volunteer_id || !message) {
    return res.status(400).json({
      success: false,
      message: 'Disaster ID, volunteer ID, dan pesan wajib diisi'
    });
  }

  const docRef = await db.collection('field_updates').add({
    disaster_id: Number(disaster_id),
    volunteer_id: Number(volunteer_id),
    message,
    condition,
    latitude,
    longitude,
    created_at: serverTimestamp()
  });

  res.status(201).json({
    success: true,
    message: 'Update lapangan berhasil dibuat',
    data: {
      id: docRef.id
    }
  });
});

const getFieldUpdatesByDisaster = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const snapshot = await db.collection('field_updates')
    .where('disaster_id', '==', Number(req.params.disasterId))
    .get();

  res.json({
    success: true,
    message: 'Update lapangan berhasil diambil',
    data: snapshot.docs.map(normalizeDoc)
  });
});

const sendChatMessage = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const { roomId } = req.params;
  const { sender_id, sender_name = null, message } = req.body;

  if (!sender_id || !message) {
    return res.status(400).json({
      success: false,
      message: 'Sender ID dan message wajib diisi'
    });
  }

  const docRef = await db
    .collection('coordination_chats')
    .doc(roomId)
    .collection('messages')
    .add({
      sender_id,
      sender_name,
      message,
      created_at: serverTimestamp()
    });

  res.status(201).json({
    success: true,
    message: 'Pesan koordinasi berhasil dikirim',
    data: {
      id: docRef.id
    }
  });
});

const getChatMessages = asyncHandler(async (req, res) => {
  const db = getFirestore();
  const snapshot = await db
    .collection('coordination_chats')
    .doc(req.params.roomId)
    .collection('messages')
    .orderBy('created_at', 'asc')
    .get();

  res.json({
    success: true,
    message: 'Pesan koordinasi berhasil diambil',
    data: snapshot.docs.map(normalizeDoc)
  });
});

module.exports = {
  updateLocation,
  getLocations,
  getLocationByVolunteer,
  deleteLocation,
  getNearbyVolunteers,
  createBroadcast,
  getBroadcasts,
  deleteBroadcast,
  updateQuickAssignmentStatus,
  getQuickAssignmentStatus,
  createFieldUpdate,
  getFieldUpdatesByDisaster,
  sendChatMessage,
  getChatMessages
};
