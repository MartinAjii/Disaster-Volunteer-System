require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const legacyRoutes = require('./routes/legacyRoutes');
const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  next();
});

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

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Backend running on port ${PORT}`);
  try {
    await testConnection();
    console.log('DB connection successful');
  } catch (err) {
    // Log but don't crash — Cloud Run needs the port open
    console.error('DB connection failed on startup:', err.message);
  }
});