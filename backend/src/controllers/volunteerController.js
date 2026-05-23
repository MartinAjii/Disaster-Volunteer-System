const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const createVolunteer = asyncHandler(async (req, res) => {
  const {
    user_id = null,
    full_name,
    phone = null,
    address = null,
    skills = null,
    availability_status = 'available',
    latitude = null,
    longitude = null
  } = req.body;

  if (!full_name) {
    return res.status(400).json({
      success: false,
      message: 'Nama relawan wajib diisi'
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO volunteers
     (user_id, full_name, phone, address, skills, availability_status, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, full_name, phone, address, skills, availability_status, latitude, longitude]
  );

  res.status(201).json({
    success: true,
    message: 'Relawan berhasil ditambahkan',
    data: {
      id: result.insertId,
      user_id,
      full_name,
      phone,
      address,
      skills,
      availability_status,
      latitude,
      longitude
    }
  });
});

const getVolunteers = asyncHandler(async (req, res) => {
  const { status, skill } = req.query;

  const params = [];
  let sql = `
    SELECT v.*, u.email, u.role
    FROM volunteers v
    LEFT JOIN users u ON v.user_id = u.id
    WHERE 1 = 1
  `;

  if (status) {
    sql += ' AND v.availability_status = ?';
    params.push(status);
  }

  if (skill) {
    sql += ' AND v.skills LIKE ?';
    params.push(`%${skill}%`);
  }

  sql += ' ORDER BY v.id DESC';

  const [rows] = await pool.execute(sql, params);

  res.json({
    success: true,
    message: 'Data relawan berhasil diambil',
    data: rows
  });
});

const getVolunteerById = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT v.*, u.email, u.role
     FROM volunteers v
     LEFT JOIN users u ON v.user_id = u.id
     WHERE v.id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Relawan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Detail relawan berhasil diambil',
    data: rows[0]
  });
});

const updateVolunteer = asyncHandler(async (req, res) => {
  const {
    full_name,
    phone = null,
    address = null,
    skills = null,
    availability_status = 'available',
    latitude = null,
    longitude = null
  } = req.body;

  const [result] = await pool.execute(
    `UPDATE volunteers
     SET full_name = ?, phone = ?, address = ?, skills = ?, availability_status = ?, latitude = ?, longitude = ?
     WHERE id = ?`,
    [full_name, phone, address, skills, availability_status, latitude, longitude, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Relawan tidak ditemukan'
    });
  }

  await pool.execute(
    `INSERT INTO volunteer_status_logs (volunteer_id, status, latitude, longitude, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [req.params.id, availability_status, latitude, longitude, 'Update data relawan']
  );

  res.json({
    success: true,
    message: 'Relawan berhasil diperbarui'
  });
});

const updateAvailability = asyncHandler(async (req, res) => {
  const { availability_status, latitude = null, longitude = null, notes = null } = req.body;

  if (!availability_status) {
    return res.status(400).json({
      success: false,
      message: 'Status ketersediaan wajib diisi'
    });
  }

  const [result] = await pool.execute(
    `UPDATE volunteers
     SET availability_status = ?, latitude = COALESCE(?, latitude), longitude = COALESCE(?, longitude)
     WHERE id = ?`,
    [availability_status, latitude, longitude, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Relawan tidak ditemukan'
    });
  }

  await pool.execute(
    `INSERT INTO volunteer_status_logs (volunteer_id, status, latitude, longitude, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [req.params.id, availability_status, latitude, longitude, notes]
  );

  res.json({
    success: true,
    message: 'Status relawan berhasil diperbarui'
  });
});

const getStatusLogs = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT * FROM volunteer_status_logs
     WHERE volunteer_id = ?
     ORDER BY logged_at DESC`,
    [req.params.id]
  );

  res.json({
    success: true,
    message: 'Riwayat status relawan berhasil diambil',
    data: rows
  });
});

const deleteVolunteer = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    'DELETE FROM volunteers WHERE id = ?',
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Relawan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Relawan berhasil dihapus'
  });
});

module.exports = {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteer,
  updateAvailability,
  getStatusLogs,
  deleteVolunteer
};
