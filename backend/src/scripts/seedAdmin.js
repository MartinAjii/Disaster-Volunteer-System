require('dotenv').config();

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function seedAdmin() {
  const name = 'Admin BNPB';
  const email = 'admin@bnpb.go.id';
  const password = 'admin12345';
  const role = 'admin';

  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (rows.length > 0) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );

  console.log('Admin created');
  console.log(`Email    : ${email}`);
  console.log(`Password : ${password}`);

  process.exit(0);
}

seedAdmin().catch(error => {
  console.error('Seed admin failed:', error.message);
  process.exit(1);
});
