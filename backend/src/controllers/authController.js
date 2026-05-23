const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'default_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );
}

const register = asyncHandler(async (req, res) => {
  const {
    name,
    full_name,
    email,
    password,
    role = 'volunteer',
    phone = null,
    address = null,
    skills = null
  } = req.body;

  const finalName = name || full_name;

  if (!finalName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nama, email, dan password wajib diisi'
    });
  }

  if (!['admin', 'volunteer'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role hanya boleh admin atau volunteer'
    });
  }

  const [exists] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (exists.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'Email sudah terdaftar'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [finalName, email, hashedPassword, role, phone]
    );

    let volunteer = null;

    if (role === 'volunteer') {
      const [volunteerResult] = await connection.execute(
        `INSERT INTO volunteers
         (user_id, full_name, phone, address, skills, availability_status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userResult.insertId, finalName, phone, address, skills, 'available']
      );

      volunteer = {
        id: volunteerResult.insertId,
        user_id: userResult.insertId,
        full_name: finalName,
        phone,
        address,
        skills,
        availability_status: 'available'
      };
    }

    await connection.commit();

    const user = {
      id: userResult.insertId,
      name: finalName,
      email,
      role,
      phone
    };

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: 'Register berhasil',
      data: {
        user,
        volunteer,
        token
      }
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi'
    });
  }

  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Email atau password salah'
    });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: 'Email atau password salah'
    });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone
  };

  const [volunteers] = await pool.execute(
    'SELECT * FROM volunteers WHERE user_id = ?',
    [user.id]
  );

  res.json({
    success: true,
    message: 'Login berhasil',
    data: {
      user: safeUser,
      volunteer: volunteers[0] || null,
      token: signToken(safeUser)
    }
  });
});

const profile = asyncHandler(async (req, res) => {
  let volunteer = null;

  if (req.user.role === 'volunteer') {
    const [rows] = await pool.execute(
      'SELECT * FROM volunteers WHERE user_id = ?',
      [req.user.id]
    );

    volunteer = rows[0] || null;
  }

  res.json({
    success: true,
    message: 'Profil berhasil diambil',
    data: {
      ...req.user,
      volunteer
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone = null, password, address = null, skills = null } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Nama wajib diisi'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.execute(
        'UPDATE users SET name = ?, phone = ?, password = ? WHERE id = ?',
        [name, phone, hashedPassword, req.user.id]
      );
    } else {
      await connection.execute(
        'UPDATE users SET name = ?, phone = ? WHERE id = ?',
        [name, phone, req.user.id]
      );
    }

    if (req.user.role === 'volunteer') {
      await connection.execute(
        `UPDATE volunteers
         SET full_name = ?, phone = ?, address = COALESCE(?, address), skills = COALESCE(?, skills)
         WHERE user_id = ?`,
        [name, phone, address, skills, req.user.id]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui'
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil. Hapus token di sisi frontend.'
  });
});

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  logout
};
