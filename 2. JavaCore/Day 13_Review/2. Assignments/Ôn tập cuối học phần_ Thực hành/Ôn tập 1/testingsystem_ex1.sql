SELECT * FROM testingsystem_ex1.candidate;
-- create database
DROP DATABASE IF EXISTS TestingSystem_EX1;
CREATE DATABASE TestingSystem_EX1;
USE TestingSystem_EX1;

-- create table: Candidate
DROP TABLE IF EXISTS 	`Candidate`;
CREATE TABLE IF NOT EXISTS `Candidate` ( 	
	id 				SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`FirstName` 	NVARCHAR(50) NOT NULL,
    `LastName` 		NVARCHAR(50) NOT NULL,
     `Phone` 		CHAR(20) NOT NULL,
     `Email` 		CHAR(50) NOT NULL,
	`password` 		VARCHAR(100) NOT NULL,	
    expInYear 		SMALLINT UNSIGNED,
	ProSkill 		ENUM('DEV', 'TEST', 'JAVA', 'SQL'),
	GraduationRank  ENUM('EXCELLENCE', 'GOOD', 'FAIR', 'POOR'),
	Category		ENUM('EXPERIENCECANDIDATE', 'FRESHERCANDIDATE') NOT NULL
);

INSERT INTO `candidate` (`FirstName`,	 `LastName`, 		`Phone`, 		`Email`, 				`password`,	 `expInYear`, 	`ProSkill`, 	`GraduationRank`,			 `Category`	) 
VALUES 					('FirstName1', 	 'LastName1',	'0988585568', 	'email1@viettel.com.vn',	 '123456aA',	 '1', 			'DEV', 				Null,			 'ExperienceCandidate'	),
						('FirstName2', 	 'LastName2',	'0987898882', 	'email2@viettel.com.vn',	 '123456aA',	 '4', 			'JAVA', 			Null,			 'ExperienceCandidate'	),
						('FirstName3', 	 'LastName3',	'0916175566', 	'email3@viettel.com.vn',	 '123456aA',	 '8', 			'SQL', 				Null,			 'ExperienceCandidate'	),
						('FirstName4', 	 'LastName4',	'0912040325', 	'email4@viettel.com.vn',	 '123456aA',	Null, 			Null, 				'EXCELLENCE',	 'FresherCandidate'	),
						('FirstName5', 	 'LastName5',	'0989965118', 	'email5@viettel.com.vn',	 '123456aA',	 Null, 			Null, 				'GOOD',			 'FresherCandidate'	),
						('FirstName6', 	 'LastName6',	'0934447788', 	'email6@viettel.com.vn',	 '123456aA',	Null, 			Null, 				'FAIR',			 'FresherCandidate'	);

-- ----------
INSERT INTO `candidate` (`FirstName`, `LastName`, `Phone`, `Email`, `password`, `expInYear`, `ProSkill`, 		`Category`)
VALUES					 (?,			 ?, 		?, 			?, 		?, 			?,			 ?,	 'ExperienceCandidate');
INSERT INTO `candidate` (`FirstName`, `LastName`, `Phone`, `Email`, `password`, `GraduationRank`,		`Category`		) 
VALUES						(?,			 ?, 		?, 		  ?, 		?, 				?,			  'FresherCandidate');
SELECT * FROM candidate c WHERE c.Email = ?;
						
       