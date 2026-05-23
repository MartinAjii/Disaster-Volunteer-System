const express = require('express');
const {
  updateLocation,
  getLocations,
  getLocationByVolunteer,
  deleteLocation,
  getNearbyVolunteers,
  createBroadcast,
  getBroadcasts,
  deleteBroadcast,
  updateQuickAssignmentStatus,
  getQuickAssignmentStatus,
  createFieldUpdate,
  getFieldUpdatesByDisaster,
  sendChatMessage,
  getChatMessages
} = require('../controllers/realtimeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/locations/:volunteerId', authMiddleware, updateLocation);
router.get('/locations', authMiddleware, getLocations);
router.get('/locations/nearby', authMiddleware, getNearbyVolunteers);
router.get('/locations/:volunteerId', authMiddleware, getLocationByVolunteer);
router.delete('/locations/:volunteerId', authMiddleware, roleMiddleware('admin'), deleteLocation);

router.post('/broadcasts', authMiddleware, roleMiddleware('admin'), createBroadcast);
router.get('/broadcasts', authMiddleware, getBroadcasts);
router.delete('/broadcasts/:id', authMiddleware, roleMiddleware('admin'), deleteBroadcast);

router.post('/assignment-status', authMiddleware, updateQuickAssignmentStatus);
router.get('/assignment-status/:assignmentId', authMiddleware, getQuickAssignmentStatus);

router.post('/field-updates', authMiddleware, createFieldUpdate);
router.get('/field-updates/:disasterId', authMiddleware, getFieldUpdatesByDisaster);

router.post('/chats/:roomId/messages', authMiddleware, sendChatMessage);
router.get('/chats/:roomId/messages', authMiddleware, getChatMessages);

module.exports = router;
