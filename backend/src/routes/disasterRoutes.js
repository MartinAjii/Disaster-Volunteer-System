const express = require('express');
const {
  createDisaster,
  getDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster
} = require('../controllers/disasterController');
const {
  createShelter,
  getShelters,
  getShelterById,
  updateShelter,
  deleteShelter
} = require('../controllers/shelterController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

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

module.exports = router;
