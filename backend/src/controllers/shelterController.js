const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const emptyToNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return value;
};

const numberOrZero = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  return Number(value);
};

const normalizeStatus = (status) => {
  if (status === 'penuh') return 'penuh';
  return 'tersedia';
};

const createShelter = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    latitude = null,
    longitude = null,
    capacity = 0,
    current_capacity = 0,
    status = 'tersedia',
    coordinator = null,
    contact = null
  } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      success: false,
      message: 'Nama posko dan lokasi wajib diisi'
    });
  }

  const cleanStatus = normalizeStatus(status);

  const result = await query(
    `INSERT INTO shelters
     (name, location, latitude, longitude, capacity, current_capacity, status, coordinator, contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      location,
      emptyToNull(latitude),
      emptyToNull(longitude),
      numberOrZero(capacity),
      numberOrZero(current_capacity),
      cleanStatus,
      emptyToNull(coordinator),
      emptyToNull(contact)
    ]
  );

  res.status(201).json({
    success: true,
    message: 'Posko berhasil ditambahkan',
    data: {
      id: result.insertId,
      name,
      location,
      latitude: emptyToNull(latitude),
      longitude: emptyToNull(longitude),
      capacity: numberOrZero(capacity),
      current_capacity: numberOrZero(current_capacity),
      status: cleanStatus,
      coordinator: emptyToNull(coordinator),
      contact: emptyToNull(contact)
    }
  });
});

const getShelters = asyncHandler(async (req, res) => {
  const rows = await query(
    'SELECT * FROM shelters ORDER BY id ASC'
  );

  res.json({
    success: true,
    message: 'Data posko berhasil diambil',
    data: rows
  });
});

const getShelterById = asyncHandler(async (req, res) => {
  const rows = await query(
    'SELECT * FROM shelters WHERE id = ?',
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Posko tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Detail posko berhasil diambil',
    data: rows[0]
  });
});

const updateShelter = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    latitude = null,
    longitude = null,
    capacity = 0,
    current_capacity = 0,
    status = 'tersedia',
    coordinator = null,
    contact = null
  } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      success: false,
      message: 'Nama posko dan lokasi wajib diisi'
    });
  }

  const cleanStatus = normalizeStatus(status);

  const result = await query(
    `UPDATE shelters
     SET name = ?, location = ?, latitude = ?, longitude = ?, capacity = ?,
         current_capacity = ?, status = ?, coordinator = ?, contact = ?
     WHERE id = ?`,
    [
      name,
      location,
      emptyToNull(latitude),
      emptyToNull(longitude),
      numberOrZero(capacity),
      numberOrZero(current_capacity),
      cleanStatus,
      emptyToNull(coordinator),
      emptyToNull(contact),
      req.params.id
    ]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Posko tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Posko berhasil diperbarui'
  });
});

const deleteShelter = asyncHandler(async (req, res) => {
  const result = await query(
    'DELETE FROM shelters WHERE id = ?',
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Posko tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Posko berhasil dihapus'
  });
});

module.exports = {
  createShelter,
  getShelters,
  getShelterById,
  updateShelter,
  deleteShelter
};