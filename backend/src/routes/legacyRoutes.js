const express = require('express');

const authRoutes = require('./authRoutes');
const {
  getDisasters,
  createDisaster,
  getDisasterById,
  updateDisaster,
  deleteDisaster
} = require('../controllers/disasterController');
const {
  getShelters,
  createShelter,
  getShelterById,
  updateShelter,
  deleteShelter
} = require('../controllers/shelterController');
const {
  getAssignments,
  createAssignment,
  getAssignmentById,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment
} = require('../controllers/assignmentController');
const {
  getVolunteers,
  createVolunteer,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer
} = require('../controllers/volunteerController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * Legacy routes dibuat agar frontend lama yang sebelumnya memakai:
 * http://localhost:3001/login
 * http://localhost:3002/assignments
 * http://localhost:3003/disasters
 * tetap bisa jalan setelah semua service digabung ke port 3000.
 */
router.use('/', authRoutes);

router.get('/volunteers', authMiddleware, getVolunteers);
router.post('/volunteers', authMiddleware, roleMiddleware('admin'), createVolunteer);
router.get('/volunteers/:id', authMiddleware, getVolunteerById);
router.put('/volunteers/:id', authMiddleware, roleMiddleware('admin'), updateVolunteer);
router.delete('/volunteers/:id', authMiddleware, roleMiddleware('admin'), deleteVolunteer);

router.get('/disasters', authMiddleware, getDisasters);
router.post('/disasters', authMiddleware, roleMiddleware('admin'), createDisaster);
router.get('/disasters/:id', authMiddleware, getDisasterById);
router.put('/disasters/:id', authMiddleware, roleMiddleware('admin'), updateDisaster);
router.delete('/disasters/:id', authMiddleware, roleMiddleware('admin'), deleteDisaster);

router.get('/shelters', authMiddleware, getShelters);
router.post('/shelters', authMiddleware, roleMiddleware('admin'), createShelter);
router.get('/shelters/:id', authMiddleware, getShelterById);
router.put('/shelters/:id', authMiddleware, roleMiddleware('admin'), updateShelter);
router.delete('/shelters/:id', authMiddleware, roleMiddleware('admin'), deleteShelter);

router.get('/assignments', authMiddleware, getAssignments);
router.post('/assignments', authMiddleware, roleMiddleware('admin'), createAssignment);
router.get('/assignments/:id', authMiddleware, getAssignmentById);
router.put('/assignments/:id', authMiddleware, roleMiddleware('admin'), updateAssignment);
router.patch('/assignments/:id/status', authMiddleware, updateAssignmentStatus);
router.delete('/assignments/:id', authMiddleware, roleMiddleware('admin'), deleteAssignment);

module.exports = router;
