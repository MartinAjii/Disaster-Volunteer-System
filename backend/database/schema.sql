CREATE DATABASE IF NOT EXISTS disaster_volunteer_db;
USE disaster_volunteer_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'volunteer') NOT NULL DEFAULT 'volunteer',
  phone VARCHAR(25),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(25),
  address TEXT,
  skills VARCHAR(255),
  availability_status ENUM('available', 'assigned', 'unavailable') NOT NULL DEFAULT 'available',
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_volunteer_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shelters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  capacity INT NOT NULL DEFAULT 0,
  current_capacity INT NOT NULL DEFAULT 0,
  coordinator VARCHAR(150),
  contact VARCHAR(25),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disasters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  disaster_date DATE NOT NULL,
  status ENUM('active', 'handled', 'closed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  disaster_id INT NOT NULL,
  shelter_id INT NULL,
  assignment_status ENUM('pending', 'assigned', 'on_the_way', 'on_site', 'completed', 'cancelled') NOT NULL DEFAULT 'assigned',
  notes TEXT,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_assignment_volunteer
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_assignment_disaster
    FOREIGN KEY (disaster_id) REFERENCES disasters(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_assignment_shelter
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NULL,
  volunteer_id INT NOT NULL,
  disaster_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  report_status ENUM('draft', 'submitted', 'verified', 'rejected') NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_assignment
    FOREIGN KEY (assignment_id) REFERENCES assignments(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_report_volunteer
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_report_disaster
    FOREIGN KEY (disaster_id) REFERENCES disasters(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS volunteer_status_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  status ENUM('available', 'assigned', 'unavailable', 'on_the_way', 'on_site', 'completed') NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  notes TEXT,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_status_log_volunteer
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
    ON DELETE CASCADE
);

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO disasters
  (title, type, description, location, latitude, longitude, severity, disaster_date, status)
SELECT
  'Banjir Bantul',
  'Banjir',
  'Banjir menyebabkan beberapa rumah warga terdampak dan membutuhkan bantuan relawan.',
  'Bantul, Yogyakarta',
  -7.8881,
  110.3288,
  'high',
  CURDATE(),
  'active'
WHERE NOT EXISTS (SELECT 1 FROM disasters WHERE title = 'Banjir Bantul');

INSERT INTO shelters
  (name, location, latitude, longitude, capacity, current_capacity, coordinator, contact)
SELECT
  'Posko Utama Bantul',
  'Bantul, Yogyakarta',
  -7.8875,
  110.3291,
  150,
  25,
  'BNPB Bantul',
  '081234567890'
WHERE NOT EXISTS (SELECT 1 FROM shelters WHERE name = 'Posko Utama Bantul');
