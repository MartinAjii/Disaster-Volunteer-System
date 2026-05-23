const express = require('express');
const {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteer,
  updateAvailability,
  getStatusLogs,
  deleteVolunteer
} = require('../controllers/volunteerController');
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

router.get('/', authMiddleware, getVolunteers);
router.post('/', authMiddleware, roleMiddleware('admin'), createVolunteer);
router.get('/:id', authMiddleware, getVolunteerById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateVolunteer);
router.patch('/:id/availability', authMiddleware, updateAvailability);
router.get('/:id/status-logs', authMiddleware, getStatusLogs);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteVolunteer);

router.get('/assignments/all', authMiddleware, getAssignments);
router.post('/assignments', authMiddleware, roleMiddleware('admin'), createAssignment);
router.get('/assignments/:id', authMiddleware, getAssignmentById);
router.put('/assignments/:id', authMiddleware, roleMiddleware('admin'), updateAssignment);
router.patch('/assignments/:id/status', authMiddleware, updateAssignmentStatus);
router.delete('/assignments/:id', authMiddleware, roleMiddleware('admin'), deleteAssignment);

module.exports = router;
