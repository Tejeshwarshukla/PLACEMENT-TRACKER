CREATE DATABASE IF NOT EXISTS placement_tracker;
USE placement_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  cgpa DECIMAL(3,2),
  email VARCHAR(120)
);

CREATE TABLE drives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  package_lpa DECIMAL(5,2),
  drive_date DATE
);

-- many-to-many: one student can apply to many drives, one drive has many students
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  drive_id INT NOT NULL,
  status ENUM('applied','shortlisted','selected','rejected') NOT NULL DEFAULT 'applied',
  UNIQUE KEY uniq_student_drive (student_id, drive_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (drive_id) REFERENCES drives(id) ON DELETE CASCADE
);
