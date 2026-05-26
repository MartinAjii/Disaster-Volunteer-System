const { pool, query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const createAssignment = asyncHandler(async (req, res) => {
  const {
    volunteer_id,
    disaster_id,
    shelter_id = null,
    assignment_status = 'assigned',
    notes = null
  } = req.body;

  if (!volunteer_id || !disaster_id) {
    return res.status(400).json({
      success: false,
      message: 'Volunteer ID dan disaster ID wajib diisi'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO assignments
       (volunteer_id, disaster_id, shelter_id, assignment_status, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [volunteer_id, disaster_id, shelter_id, assignment_status, notes]
    );

    await connection.execute(
      'UPDATE volunteers SET availability_status = ? WHERE id = ?',
      ['assigned', volunteer_id]
    );

    await connection.execute(
      `INSERT INTO volunteer_status_logs (volunteer_id, status, notes)
       VALUES (?, ?, ?)`,
      [volunteer_id, 'assigned', 'Relawan menerima penugasan']
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Penugasan berhasil dibuat',
      data: {
        id: result.insertId,
        volunteer_id,
        disaster_id,
        shelter_id,
        assignment_status,
        notes
      }
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

const getAssignments = asyncHandler(async (req, res) => {

  const {
    volunteer_id,
    disaster_id,
    status
  } = req.query;

  const params = [];

  let sql = `
    SELECT
      a.*,

      v.full_name AS volunteer_name,

      d.title AS disaster_title,
      d.location AS disaster_location,

      s.name AS shelter_name,

      r.id AS report_id,
      r.title AS report_title,
      r.content AS report_content,
      r.photo_url,
      r.report_status,
      r.updated_at AS report_updated_at

    FROM assignments a

    JOIN volunteers v
      ON a.volunteer_id = v.id

    JOIN disasters d
      ON a.disaster_id = d.id

    LEFT JOIN shelters s
      ON a.shelter_id = s.id

    LEFT JOIN reports r
      ON r.assignment_id = a.id

    WHERE 1 = 1
  `;

  // Jika volunteer (bukan admin), hanya tampilkan assignment milik mereka
  if (req.user.role === 'volunteer') {
    const volunteerData = await query(
      'SELECT id FROM volunteers WHERE user_id = ?',
      [req.user.id]
    );

    if (volunteerData.length > 0) {
      sql += ' AND a.volunteer_id = ?';
      params.push(volunteerData[0].id);
    } else {
      return res.json({
        success: true,
        message: 'Data penugasan berhasil diambil',
        data: []
      });
    }
  }

  if (volunteer_id) {

    sql += ' AND a.volunteer_id = ?';

    params.push(volunteer_id);
  }

  if (disaster_id) {

    sql += ' AND a.disaster_id = ?';

    params.push(disaster_id);
  }

  if (status) {

    sql += ' AND a.assignment_status = ?';

    params.push(status);
  }

  sql += `
    ORDER BY
      a.id ASC,
      r.updated_at DESC
  `;

  const rows = await query(sql, params);

  res.json({

    success: true,

    message:
      'Data penugasan berhasil diambil',

    data: rows
  });
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const rows = await query(
    `SELECT
      a.*,
      v.full_name AS volunteer_name,
      d.title AS disaster_title,
      d.location AS disaster_location,
      s.name AS shelter_name
     FROM assignments a
     JOIN volunteers v ON a.volunteer_id = v.id
     JOIN disasters d ON a.disaster_id = d.id
     LEFT JOIN shelters s ON a.shelter_id = s.id
     WHERE a.id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Penugasan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Detail penugasan berhasil diambil',
    data: rows[0]
  });
});

const updateAssignment = asyncHandler(async (req, res) => {
  const {
    volunteer_id,
    disaster_id,
    shelter_id = null,
    assignment_status = 'assigned',
    notes = null,
    completed_at = null
  } = req.body;

  const result = await query(
    `UPDATE assignments
     SET volunteer_id = ?, disaster_id = ?, shelter_id = ?, assignment_status = ?, notes = ?, completed_at = ?
     WHERE id = ?`,
    [volunteer_id, disaster_id, shelter_id, assignment_status, notes, completed_at, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Penugasan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Penugasan berhasil diperbarui'
  });
});

const updateAssignmentStatus = asyncHandler(async (req, res) => {
  const { assignment_status, notes = null } = req.body;

  if (!assignment_status) {
    return res.status(400).json({
      success: false,
      message: 'Status penugasan wajib diisi'
    });
  }

  const [assignments] = await pool.execute(
    'SELECT * FROM assignments WHERE id = ?',
    [req.params.id]
  );

  if (assignments.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Penugasan tidak ditemukan'
    });
  }

  const assignment = assignments[0];
  const completedAt = assignment_status === 'completed' ? new Date() : null;

  await pool.execute(
    `UPDATE assignments
     SET assignment_status = ?, notes = COALESCE(?, notes), completed_at = COALESCE(?, completed_at)
     WHERE id = ?`,
    [assignment_status, notes, completedAt, req.params.id]
  );

  const volunteerStatus =
    assignment_status === 'completed' || assignment_status === 'cancelled'
      ? 'available'
      : assignment_status === 'on_the_way'
        ? 'on_the_way'
        : assignment_status === 'on_site'
          ? 'on_site'
          : 'assigned';

  await pool.execute(
    'UPDATE volunteers SET availability_status = ? WHERE id = ?',
    [
      volunteerStatus === 'available' ? 'available' : 'assigned',
      assignment.volunteer_id
    ]
  );

  await pool.execute(
    `INSERT INTO volunteer_status_logs (volunteer_id, status, notes)
     VALUES (?, ?, ?)`,
    [assignment.volunteer_id, volunteerStatus, notes || `Status penugasan: ${assignment_status}`]
  );

  res.json({
    success: true,
    message: 'Status penugasan berhasil diperbarui'
  });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const result = await query(
    'DELETE FROM assignments WHERE id = ?',
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Penugasan tidak ditemukan'
    });
  }

  res.json({
    success: true,
    message: 'Penugasan berhasil dihapus'
  });
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment
};
