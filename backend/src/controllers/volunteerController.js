const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { pool, query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const normalizeNullable = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return value;
};

const generateRandomPassword = (length = 10) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#';
  const bytes = crypto.randomBytes(length);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
};

const createVolunteer = asyncHandler(async (req, res) => {
  const {
    full_name,
    email,
    phone = null,
    address = null,
    skills = null,
    availability_status = 'available',
    latitude = null,
    longitude = null
  } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nama relawan dan email wajib diisi'
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Format email tidak valid'
    });
  }

  const allowedStatuses = ['available', 'assigned', 'unavailable'];
  const cleanStatus = allowedStatuses.includes(availability_status)
    ? availability_status
    : 'available';

  const existingUser = await query(
    'SELECT id FROM users WHERE email = ?',
    [cleanEmail]
  );

  if (existingUser.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Email sudah digunakan oleh user lain'
    });
  }

  const defaultPassword = generateRandomPassword(10);
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `INSERT INTO users
       (name, email, password, role, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, cleanEmail, hashedPassword, 'volunteer', normalizeNullable(phone)]
    );

    const [volunteerResult] = await connection.execute(
      `INSERT INTO volunteers
       (user_id, full_name, phone, address, skills, availability_status, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.insertId,
        full_name,
        normalizeNullable(phone),
        normalizeNullable(address),
        normalizeNullable(skills),
        cleanStatus,
        normalizeNullable(latitude),
        normalizeNullable(longitude)
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Relawan dan akun user berhasil ditambahkan',
      data: {
        volunteer: {
          id: volunteerResult.insertId,
          user_id: userResult.insertId,
          full_name,
          phone: normalizeNullable(phone),
          address: normalizeNullable(address),
          skills: normalizeNullable(skills),
          availability_status: cleanStatus,
          latitude: normalizeNullable(latitude),
          longitude: normalizeNullable(longitude)
        },
        user: {
          id: userResult.insertId,
          name: full_name,
          email: cleanEmail,
          role: 'volunteer',
          phone: normalizeNullable(phone)
        },
        default_password: defaultPassword
      }
    });
  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email atau data relawan sudah digunakan'
      });
    }

    throw error;
  } finally {
    connection.release();
  }
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

  sql += ' ORDER BY v.id ASC';

  const rows = await query(sql, params);

  res.json({
    success: true,
    message: 'Data relawan berhasil diambil',
    data: rows
  });
});

const getVolunteerById = asyncHandler(async (req, res) => {
  const rows = await query(
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

  const result = await query(
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

  const result = await query(
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
  const rows = await query(
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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT user_id FROM volunteers WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: 'Relawan tidak ditemukan'
      });
    }

    const userId = rows[0].user_id;

    const [deleteVolunteerResult] = await connection.execute(
      'DELETE FROM volunteers WHERE id = ?',
      [req.params.id]
    );

    if (deleteVolunteerResult.affectedRows === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: 'Relawan tidak ditemukan'
      });
    }

    if (userId) {
      await connection.execute(
        'DELETE FROM users WHERE id = ? AND role = ?',
        [userId, 'volunteer']
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Relawan dan akun user berhasil dihapus'
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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