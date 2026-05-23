const express = require('express');
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment
} = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAssignments);
router.post('/', authMiddleware, roleMiddleware('admin'), createAssignment);
router.get('/:id', authMiddleware, getAssignmentById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateAssignment);
router.patch('/:id/status', authMiddleware, updateAssignmentStatus);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteAssignment);

module.exports = router;
