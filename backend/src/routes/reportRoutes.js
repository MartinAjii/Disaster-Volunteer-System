const express = require('express');
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getReports);
router.post('/', authMiddleware, upload.single('photo'), createReport);
router.get('/:id', authMiddleware, getReportById);
router.put('/:id', authMiddleware, upload.single('photo'), updateReport);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteReport);

module.exports = router;
