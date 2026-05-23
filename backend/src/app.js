require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const legacyRoutes = require('./routes/legacyRoutes');
const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({
  origin: allowedOrigin === '*'
    ? '*'
    : allowedOrigin.split(',').map(origin => origin.trim()),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Merged Disaster Volunteer Backend is running',
    version: '2.0.0'
  });
});

app.use('/api', apiRoutes);
app.use('/', legacyRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  await testConnection();
});
