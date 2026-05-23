const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const createDisaster = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    description = null,
    location,
    latitude = null,
    longitude = null,
    severity = 'medium',
    disaster_date,
    status = 'active'
  } = req.body;

  if (!title || !type || !location || !disaster_date) {
    return res.status(400).json({
      success: false,
      message: 'Judul, jenis, lokasi, dan tanggal bencana wajib diisi'
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO disasters
     (title, type, description, location, latitude, longitude, severity, disaster_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, type, description, location, latitude, longitude, severity, disaster_date, status]
  );

  res.status(201).json({
    success: true,
    message: 'Bencana berhasil ditambahkan',
    data: {
      id: result.insertId,
      title,
      type,
      description,
      location,
      latitude,
      longitude,
      severity,
      disaster_date,
      status
    }
  });
});

const getDisasters = asyncHandler(async (req, res) => {
  const { status, severity } = req.query;
  const params = [];
  let sql = 'SELECT * FROM disasters WHERE 1 = 1';

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (severity) {
    sql += ' AND severity = ?';
    params.push(severity);
  }

  sql += ' ORDER BY id ASC';

  const [rows] = await pool.execute(sql, params);

  res.json({
    success: true,
    message: 'Data bencana berhasil diambil',
    data: rows
  });
});

const getDisasterById = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM disasters WHERE id = ?',
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Bencana tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Detail bencana berhasil diambil',
    data: rows[0]
  });
});

const updateDisaster = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    description = null,
    location,
    latitude = null,
    longitude = null,
    severity = 'medium',
    disaster_date,
    status = 'active'
  } = req.body;

  const [result] = await pool.execute(
    `UPDATE disasters
     SET title = ?, type = ?, description = ?, location = ?, latitude = ?, longitude = ?, severity = ?, disaster_date = ?, status = ?
     WHERE id = ?`,
    [title, type, description, location, latitude, longitude, severity, disaster_date, status, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Bencana tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Bencana berhasil diperbarui'
  });
});

const deleteDisaster = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    'DELETE FROM disasters WHERE id = ?',
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Bencana tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Bencana berhasil dihapus'
  });
});

module.exports = {
  createDisaster,
  getDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster
};
