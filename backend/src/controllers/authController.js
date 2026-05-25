const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {

  return jwt.sign(

    {
      id: user.id,
      email: user.email,
      role: user.role
    },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || '1d'
    }
  );
}

const register =
  asyncHandler(async (req, res) => {

    const {
      name,
      email,
      password,
      phone,
      address,
      skills
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Nama, email, dan password wajib diisi'
      });
    }

    const existingUser =
      await query(

        'SELECT id FROM users WHERE email = ?',

        [email]
      );

    if (existingUser.length > 0) {

      return res.status(400).json({

        success: false,

        message:
          'Email sudah digunakan'
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result =
      await query(

        `INSERT INTO users
        (
          name,
          email,
          password,
          role,
          phone
        )
        VALUES (?, ?, ?, ?, ?)`,

        [
          name,
          email,
          hashedPassword,
          'volunteer',
          phone
        ]
      );

    await query(

      `INSERT INTO volunteers
      (
        user_id,
        full_name,
        phone,
        address,
        skills,
        availability_status
      )
      VALUES (?, ?, ?, ?, ?, ?)`,

      [
        result.insertId,
        name,
        phone,
        address,
        skills,
        'available'
      ]
    );

    res.status(201).json({

      success: true,

      message:
        'Register berhasil'
    });
  });

const login =
  asyncHandler(async (req, res) => {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message:
          'Email dan password wajib diisi'
      });
    }

    const rows =
      await query(

        'SELECT * FROM users WHERE email = ?',

        [email]
      );

    if (rows.length === 0) {

      return res.status(401).json({

        success: false,

        message:
          'Email atau password salah'
      });
    }

    const user = rows[0];

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {

      return res.status(401).json({

        success: false,

        message:
          'Email atau password salah'
      });
    }

    const volunteerRows =
      await query(

        `SELECT *
        FROM volunteers
        WHERE user_id = ?`,

        [user.id]
      );

    const volunteer =
      volunteerRows[0] || null;

    const safeUser = {

      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    const token =
      signToken(safeUser);

    res.json({

      success: true,

      message:
        'Login berhasil',

      token,

      data: {

        ...safeUser,

        volunteer
      }
    });
  });

const profile =
  asyncHandler(async (req, res) => {

    let volunteer = null;

    if (req.user.role === 'volunteer') {

      const rows =
        await query(

          'SELECT * FROM volunteers WHERE user_id = ?',

          [req.user.id]
        );

      volunteer =
        rows[0] || null;
    }

    res.json({

      success: true,

      message:
        'Profil berhasil diambil',

      data: {
        ...req.user,
        volunteer
      }
    });
  });

const updateProfile =
  asyncHandler(async (req, res) => {

    const {
      name,
      phone = null,
      password,
      address = null,
      skills = null
    } = req.body;

    if (!name) {

      return res.status(400).json({

        success: false,

        message:
          'Nama wajib diisi'
      });
    }

    const connection =
      await pool.getConnection();

    try {

      await connection.beginTransaction();

      if (password) {

        const hashedPassword =
          await bcrypt.hash(password, 10);

        await connection.execute(

          `UPDATE users
          SET
            name = ?,
            phone = ?,
            password = ?
          WHERE id = ?`,

          [
            name,
            phone,
            hashedPassword,
            req.user.id
          ]
        );

      } else {

        await connection.execute(

          `UPDATE users
          SET
            name = ?,
            phone = ?
          WHERE id = ?`,

          [
            name,
            phone,
            req.user.id
          ]
        );
      }

      if (
        req.user.role ===
        'volunteer'
      ) {

        await connection.execute(

          `UPDATE volunteers
          SET
            full_name = ?,
            phone = ?,
            address = ?,
            skills = ?
          WHERE user_id = ?`,

          [
            name,
            phone,
            address,
            skills,
            req.user.id
          ]
        );
      }

      await connection.commit();

      res.json({

        success: true,

        message:
          'Profil berhasil diperbarui'
      });

    } catch (error) {

      await connection.rollback();

      throw error;

    } finally {

      connection.release();
    }
  });

const logout =
  asyncHandler(async (req, res) => {

    res.json({

      success: true,

      message:
        'Logout berhasil'
    });
  });

module.exports = {register, login, profile, updateProfile, logout};