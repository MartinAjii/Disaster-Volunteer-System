const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const createShelter = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    latitude = null,
    longitude = null,
    capacity = 0,
    current_capacity = 0,
    coordinator = null,
    contact = null
  } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      success: false,
      message: 'Nama posko dan lokasi wajib diisi'
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO shelters
     (name, location, latitude, longitude, capacity, current_capacity, coordinator, contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, location, latitude, longitude, capacity, current_capacity, coordinator, contact]
  );

  res.status(201).json({
    success: true,
    message: 'Posko berhasil ditambahkan',
    data: {
      id: result.insertId,
      name,
      location,
      latitude,
      longitude,
      capacity,
      current_capacity,
      coordinator,
      contact
    }
  });
});

const getShelters = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM shelters ORDER BY id ASC'
  );

  res.json({
    success: true,
    message: 'Data posko berhasil diambil',
    data: rows
  });
});

const getShelterById = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
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
    coordinator = null,
    contact = null
  } = req.body;

  const [result] = await pool.execute(
    `UPDATE shelters
     SET name = ?, location = ?, latitude = ?, longitude = ?, capacity = ?, current_capacity = ?, coordinator = ?, contact = ?
     WHERE id = ?`,
    [name, location, latitude, longitude, capacity, current_capacity, coordinator, contact, req.params.id]
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
  const [result] = await pool.execute(
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
