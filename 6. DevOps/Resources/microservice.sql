-- Drop the database if it already exists
DROP DATABASE IF EXISTS microservice;

-- Create database
CREATE DATABASE IF NOT EXISTS microservice;
USE microservice;

-- Create table Department
DROP TABLE IF EXISTS `department`;
CREATE TABLE IF NOT EXISTS `department` (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`          NVARCHAR(50) NOT NULL UNIQUE,
    total_member    INT UNSIGNED,
    `type`          ENUM('DEV', 'TEST', 'BA', 'PM') NOT NULL,
    created_at    DATETIME DEFAULT NOW()
);

-- Create table Account
DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE,
    email	    VARCHAR(50) NOT NULL UNIQUE,
    `password`      VARCHAR(800) NOT NULL,
    first_name      NVARCHAR(50) NOT NULL,
    last_name       NVARCHAR(50) NOT NULL,
    status          INT NOT NULL,
    `role`          ENUM('ADMIN', 'USER', 'MANAGER') NOT NULL DEFAULT 'USER',
    department_id   INT UNSIGNED NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- =============================================
-- INSERT DATA
-- =============================================

-- Add data to Department
INSERT INTO `department` (`name`, total_member, `type`, created_at) 
VALUES
    (N'Marketing', 1, 'DEV', '2020-03-05'),
    (N'Sale', 2, 'TEST', '2020-03-05'),
    (N'Bao ve', 3, 'BA', '2020-03-07'),
    (N'Nhan su', 4, 'PM', '2020-03-08'),
    (N'Ky thuat', 5, 'DEV', '2020-03-10'),
    (N'Tai Chinh', 6, 'TEST', NOW()),
    (N'Pho giam doc', 7, 'PM', NOW()),
    (N'Giam doc', 8, 'TEST', '2020-04-07'),
    (N'Thu ky', 9, 'PM', '2020-04-07'),
    (N'Ban hang', 1, 'DEV', '2020-04-09');

-- Add data to Account
-- Password: 123456 (hashed using bcrypt)
INSERT INTO `account` (username, email, `password`, first_name, last_name,status, `role`, department_id) 
VALUES
    ('dangblack', 'dangblack@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Nguyen', 'Hai Dang',1, 'ADMIN', 5),
    ('quanganh', 'quanganh@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Nguyen', 'Quang Anh',0, 'MANAGER', 1),
    ('vanchien', 'vanchien@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Tran', 'Van Chien',1, 'ADMIN', 1),
    ('cocoduongqua', 'cocoduongqua@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Nguyen', 'Co Co',0, 'USER', 1),
    ('doccocaubai', 'doccocaubai@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Nguyen', 'Doc Co',1, 'ADMIN', 2),
    ('khabanh', 'khabanh@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Phan', 'Kha Bang',0, 'USER', 2),
    ('huanhoahong', 'huanhoahong@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Tran', 'Van Huan',1, 'ADMIN', 2),
    ('tungnui', 'tungnui@gmail.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Nguyen', 'Tung Nui',0, 'MANAGER', 8),
    ('duongghuu', 'duongghuu@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Phan', 'Duong Huu',1, 'ADMIN', 9),
    ('vtiaccademy', 'vtiaccademy@gmail.com','$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUravfLpyIFi', 'Tran', 'Academy',0, 'MANAGER', 3);

