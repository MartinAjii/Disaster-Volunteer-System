const { query } = require('../config/db');

const { uploadBuffer } =
  require('../config/storage');

const asyncHandler =
  require('../utils/asyncHandler');

const createReport =
  asyncHandler(async (req, res) => {

    const {
      assignment_id = null,
      disaster_id,
      title,
      content,
      photo_url = null,
      report_status = 'submitted'
    } = req.body;

    const volunteerRows =
      await query(

        'SELECT id FROM volunteers WHERE user_id = ?',

        [req.user.id]
      );

    if (volunteerRows.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Volunteer tidak ditemukan'
      });
    }

    const volunteer_id =
      volunteerRows[0].id;

    if (
      !disaster_id ||
      !title ||
      !content
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Data laporan belum lengkap'
      });
    }

    let finalPhotoUrl =
      photo_url;

    if (req.file) {

      const base64 =
        req.file.buffer.toString('base64');

      const mimeType =
        req.file.mimetype ||
        'image/jpeg';

      finalPhotoUrl =
        `data:${mimeType};base64,${base64}`;

      console.log(
        '=== PHOTO DEBUG ==='
      );

      console.log(
        'Original file size:',
        req.file.size,
        'bytes'
      );

      console.log(
        'Base64 size:',
        finalPhotoUrl.length,
        'bytes'
      );

      console.log(
        'MIME type:',
        mimeType
      );

      console.log(
        'Base64 preview:',
        finalPhotoUrl.substring(0, 50),
        '...'
      );

      console.log(
        '==================='
      );
    }

    const result =
      await query(

        `INSERT INTO reports
        (
          assignment_id,
          volunteer_id,
          disaster_id,
          title,
          content,
          photo_url,
          report_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,

        [
          assignment_id,
          volunteer_id,
          disaster_id,
          title,
          content,
          finalPhotoUrl,
          report_status
        ]
      );

    res.status(201).json({

      success: true,

      message:
        'Laporan berhasil dibuat',

      data: {

        id:
          result.insertId,

        assignment_id,

        volunteer_id,

        disaster_id,

        title,

        content,

        photo_url:
          finalPhotoUrl,

        report_status
      }
    });
  });

const getReports =
  asyncHandler(async (req, res) => {

    const {
      assignment_id,
      disaster_id,
      volunteer_id,
      status
    } = req.query;

    const params = [];

    let sql = `
      SELECT
        r.*,
        v.full_name AS volunteer_name,
        d.title AS disaster_title
      FROM reports r
      JOIN volunteers v
        ON r.volunteer_id = v.id
      JOIN disasters d
        ON r.disaster_id = d.id
      WHERE 1 = 1
    `;

    if (assignment_id) {

      sql +=
        ' AND r.assignment_id = ?';

      params.push(
        assignment_id
      );
    }

    if (disaster_id) {

      sql +=
        ' AND r.disaster_id = ?';

      params.push(
        disaster_id
      );
    }

    if (volunteer_id) {

      sql +=
        ' AND r.volunteer_id = ?';

      params.push(
        volunteer_id
      );
    }

    if (status) {

      sql +=
        ' AND r.report_status = ?';

      params.push(status);
    }

    sql +=
      ' ORDER BY r.id DESC';

    const rows =
      await query(sql, params);

    res.json({

      success: true,

      message:
        'Data laporan berhasil diambil',

      data: rows
    });
  });

const getReportById =
  asyncHandler(async (req, res) => {

    const rows =
      await query(

        `SELECT
          r.*,
          v.full_name AS volunteer_name,
          d.title AS disaster_title
        FROM reports r
        JOIN volunteers v
          ON r.volunteer_id = v.id
        JOIN disasters d
          ON r.disaster_id = d.id
        WHERE r.id = ?`,

        [req.params.id]
      );

    if (rows.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Laporan tidak ditemukan'
      });
    }

    res.json({

      success: true,

      message:
        'Detail laporan berhasil diambil',

      data: rows[0]
    });
  });

const updateReport =
  asyncHandler(async (req, res) => {

    const {
      assignment_id = null,
      disaster_id,
      title,
      content,
      photo_url = null
    } = req.body;

    const volunteerRows =
      await query(

        'SELECT id FROM volunteers WHERE user_id = ?',

        [req.user.id]
      );

    if (volunteerRows.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Volunteer tidak ditemukan'
      });
    }

    const volunteer_id =
      volunteerRows[0].id;

    let finalPhotoUrl =
      photo_url;

    if (req.file) {

      const base64 =
        req.file.buffer.toString('base64');

      const mimeType =
        req.file.mimetype ||
        'image/jpeg';

      finalPhotoUrl =
        `data:${mimeType};base64,${base64}`;

      console.log(
        'Photo stored as base64, size:',
        finalPhotoUrl.length,
        'bytes'
      );
    }

    const oldReport =
      await query(

        'SELECT * FROM reports WHERE id = ?',

        [req.params.id]
      );

    if (oldReport.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Laporan tidak ditemukan'
      });
    }

    if (!finalPhotoUrl) {

      finalPhotoUrl =
        oldReport[0]
          .photo_url;
    }

    const result =
      await query(

        `UPDATE reports
        SET
          assignment_id = ?,
          volunteer_id = ?,
          disaster_id = ?,
          title = ?,
          content = ?,
          photo_url = ?,
          report_status = 'submitted',
          verified_by = NULL,
          verified_at = NULL
        WHERE id = ?`,

        [
          assignment_id,
          volunteer_id,
          disaster_id,
          title,
          content,
          finalPhotoUrl,
          req.params.id
        ]
      );

    if (result.affectedRows === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Laporan tidak ditemukan'
      });
    }

    res.json({

      success: true,

      message:
        'Laporan revisi berhasil dikirim'
    });
  });

const deleteReport =
  asyncHandler(async (req, res) => {

    const result =
      await query(

        'DELETE FROM reports WHERE id = ?',

        [req.params.id]
      );

    if (result.affectedRows === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Laporan tidak ditemukan'
      });
    }

    res.json({

      success: true,

      message:
        'Laporan berhasil dihapus'
    });
  });

const verifyReport =
  asyncHandler(async (req, res) => {

    const { status } =
      req.body;

    if (
      ![
        'verified',
        'rejected'
      ].includes(status)
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Status tidak valid'
      });
    }

    const reports =
      await query(

        'SELECT * FROM reports WHERE id = ?',

        [req.params.id]
      );

    if (reports.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          'Laporan tidak ditemukan'
      });
    }

    const report =
      reports[0];

    await query(

      `UPDATE reports
      SET
        report_status = ?,
        verified_by = ?,
        verified_at = NOW()
      WHERE id = ?`,

      [
        status,
        req.user.id,
        report.id
      ]
    );

    if (status === 'verified') {

      await query(

        `UPDATE assignments
        SET assignment_status = 'completed'
        WHERE id = ?`,

        [report.assignment_id]
      );

      await query(

        `UPDATE volunteers
        SET availability_status = 'available'
        WHERE id = ?`,

        [report.volunteer_id]
      );
    }

    res.json({

      success: true,

      message:
        `Laporan ${status}`
    });
  });

module.exports = {

  createReport,

  getReports,

  getReportById,

  updateReport,

  deleteReport,

  verifyReport
};