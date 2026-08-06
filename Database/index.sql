CREATE DATABASE testing_system;

DROP TABLE department;


CREATE TABLE department (
	departmentId int PRIMARY KEY AUTO_INCREMENT,
	departmentName varchar(200)
);

CREATE TABLE position (
	positionId int PRIMARY KEY AUTO_INCREMENT,
	positionName varchar(100)
);

CREATE TABLE account (
	accountId int PRIMARY KEY AUTO_INCREMENT,
	email varchar(120) unique,
	username varchar(50) unique NOT NULL,
	fullName varchar(100),
	createDate datetime NOT NULL,
	
	departmentId int,
	positionId int
);

CREATE TABLE group (
	groupId int PRIMARY KEY AUTO_INCREMENT,
	groupName varchar(100) NOT NULL,
	createDate datetime NOT NULL,
	
	creatorId int,
);