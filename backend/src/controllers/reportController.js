const { pool } = require('../config/db');
const { uploadBuffer } = require('../config/storage');
const asyncHandler = require('../utils/asyncHandler');

const createReport = asyncHandler(async (req, res) => {
  const {
    assignment_id = null,
    volunteer_id,
    disaster_id,
    title,
    content,
    photo_url = null,
    report_status = 'submitted'
  } = req.body;

  if (!volunteer_id || !disaster_id || !title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Volunteer ID, disaster ID, judul, dan isi laporan wajib diisi'
    });
  }

  let finalPhotoUrl = photo_url;

  if (req.file) {
    const uploaded = await uploadBuffer(req.file, 'reports');
    if (uploaded) {
      finalPhotoUrl = uploaded;
    }
  }

  const [result] = await pool.execute(
    `INSERT INTO reports
     (assignment_id, volunteer_id, disaster_id, title, content, photo_url, report_status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [assignment_id, volunteer_id, disaster_id, title, content, finalPhotoUrl, report_status]
  );

  res.status(201).json({
    success: true,
    message: 'Laporan berhasil dibuat',
    data: {
      id: result.insertId,
      assignment_id,
      volunteer_id,
      disaster_id,
      title,
      content,
      photo_url: finalPhotoUrl,
      report_status
    }
  });
});

const getReports = asyncHandler(async (req, res) => {
  const { disaster_id, volunteer_id, status } = req.query;
  const params = [];

  let sql = `
    SELECT
      r.*,
      v.full_name AS volunteer_name,
      d.title AS disaster_title
    FROM reports r
    JOIN volunteers v ON r.volunteer_id = v.id
    JOIN disasters d ON r.disaster_id = d.id
    WHERE 1 = 1
  `;

  if (disaster_id) {
    sql += ' AND r.disaster_id = ?';
    params.push(disaster_id);
  }

  if (volunteer_id) {
    sql += ' AND r.volunteer_id = ?';
    params.push(volunteer_id);
  }

  if (status) {
    sql += ' AND r.report_status = ?';
    params.push(status);
  }

  sql += ' ORDER BY r.created_at DESC, r.id DESC';

  const [rows] = await pool.execute(sql, params);

  res.json({
    success: true,
    message: 'Data laporan berhasil diambil',
    data: rows
  });
});

const getReportById = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT
      r.*,
      v.full_name AS volunteer_name,
      d.title AS disaster_title
     FROM reports r
     JOIN volunteers v ON r.volunteer_id = v.id
     JOIN disasters d ON r.disaster_id = d.id
     WHERE r.id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Laporan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Detail laporan berhasil diambil',
    data: rows[0]
  });
});

const updateReport = asyncHandler(async (req, res) => {
  const {
    assignment_id = null,
    volunteer_id,
    disaster_id,
    title,
    content,
    photo_url = null,
    report_status = 'submitted'
  } = req.body;

  let finalPhotoUrl = photo_url;

  if (req.file) {
    const uploaded = await uploadBuffer(req.file, 'reports');
    if (uploaded) {
      finalPhotoUrl = uploaded;
    }
  }

  const [result] = await pool.execute(
    `UPDATE reports
     SET assignment_id = ?, volunteer_id = ?, disaster_id = ?, title = ?, content = ?, photo_url = ?, report_status = ?
     WHERE id = ?`,
    [assignment_id, volunteer_id, disaster_id, title, content, finalPhotoUrl, report_status, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Laporan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Laporan berhasil diperbarui'
  });
});

const deleteReport = asyncHandler(async (req, res) => {
  const [result] = await pool.execute(
    'DELETE FROM reports WHERE id = ?',
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Laporan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Laporan berhasil dihapus'
  });
});

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
};
