const express = require('express');

const authRoutes = require('./authRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const disasterRoutes = require('./disasterRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const reportRoutes = require('./reportRoutes');
const realtimeRoutes = require('./realtimeRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Disaster Volunteer System API',
    services_merged: [
      'auth-service',
      'disaster-service',
      'realtime-service'
    ],
    modules: {
      auth: '/api/auth',
      volunteers: '/api/volunteers',
      disasters: '/api/disasters',
      shelters: '/api/shelters',
      assignments: '/api/assignments',
      reports: '/api/reports',
      realtime: '/api/realtime'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/', disasterRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/reports', reportRoutes);
router.use('/realtime', realtimeRoutes);

module.exports = router;
