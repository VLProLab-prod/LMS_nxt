-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: lms
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contentitems`
--

DROP TABLE IF EXISTS `contentitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contentitems` (
  `content_id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `estimated_duration_min` int DEFAULT NULL,
  `learning_objectives` text,
  `workflow_status` enum('Planned','Scripted','Editing','Post-Editing','Ready_for_Video_Prep','Under_Review','Published') NOT NULL DEFAULT 'Planned',
  `video_link` text,
  `review_notes` text,
  `uploaded_by_editor_id` int DEFAULT NULL,
  `practice_questions_url` text,
  `reference_material_url` text,
  PRIMARY KEY (`content_id`),
  KEY `section_id` (`section_id`),
  KEY `uploaded_by_editor_id` (`uploaded_by_editor_id`),
  CONSTRAINT `contentitems_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `coursesections` (`section_id`) ON DELETE CASCADE,
  CONSTRAINT `contentitems_ibfk_2` FOREIGN KEY (`uploaded_by_editor_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentitems`
--

LOCK TABLES `contentitems` WRITE;
/*!40000 ALTER TABLE `contentitems` DISABLE KEYS */;
INSERT INTO `contentitems` VALUES (1,1,'Topic 1 Detail',45,'Objectives for Unit 1','Scripted',NULL,NULL,NULL,NULL,NULL),(2,2,'Topic 2 Detail',45,'Objectives for Unit 2','Planned',NULL,NULL,NULL,NULL,NULL),(3,3,'Topic 3 Detail',45,'Objectives for Unit 3','Planned',NULL,NULL,NULL,NULL,NULL),(4,4,'Topic 4 Detail',45,'Objectives for Unit 4','Planned',NULL,NULL,NULL,NULL,NULL),(5,5,'Topic 5 Detail',45,'Objectives for Unit 5','Planned',NULL,NULL,NULL,NULL,NULL),(6,6,'Topic 1 Detail',45,'Objectives for Unit 1','Ready_for_Video_Prep',NULL,NULL,NULL,NULL,NULL),(7,7,'Topic 2 Detail',45,'Objectives for Unit 2','Scripted',NULL,NULL,NULL,NULL,NULL),(8,8,'Topic 3 Detail',45,'Objectives for Unit 3','Ready_for_Video_Prep',NULL,NULL,NULL,NULL,NULL),(9,9,'Topic 4 Detail',45,'Objectives for Unit 4','Scripted',NULL,NULL,NULL,NULL,NULL),(10,10,'Topic 5 Detail',45,'Objectives for Unit 5','Ready_for_Video_Prep',NULL,NULL,NULL,NULL,NULL),(11,11,'Topic 1 Detail',45,'Objectives for Unit 1','Scripted',NULL,NULL,NULL,NULL,NULL),(12,12,'Topic 2 Detail',45,'Objectives for Unit 2','Scripted',NULL,NULL,NULL,NULL,NULL),(13,13,'Topic 3 Detail',45,'Objectives for Unit 3','Scripted',NULL,NULL,NULL,NULL,NULL),(14,14,'Topic 4 Detail',45,'Objectives for Unit 4','Planned',NULL,NULL,NULL,NULL,NULL),(15,15,'Topic 5 Detail',45,'Objectives for Unit 5','Planned',NULL,NULL,NULL,NULL,NULL),(16,16,'Topic 1 Detail',45,'Objectives for Unit 1','Scripted',NULL,NULL,NULL,NULL,NULL),(17,17,'Topic 2 Detail',45,'Objectives for Unit 2','Planned',NULL,NULL,NULL,NULL,NULL),(18,18,'Topic 3 Detail',45,'Objectives for Unit 3','Planned',NULL,NULL,NULL,NULL,NULL),(19,19,'Topic 4 Detail',45,'Objectives for Unit 4','Planned',NULL,NULL,NULL,NULL,NULL),(20,20,'Topic 5 Detail',45,'Objectives for Unit 5','Planned',NULL,NULL,NULL,NULL,NULL),(21,21,'Topic 1 Detail',45,'Objectives for Unit 1','Scripted',NULL,NULL,NULL,NULL,NULL),(22,22,'Topic 2 Detail',45,'Objectives for Unit 2','Scripted',NULL,NULL,NULL,NULL,NULL),(23,23,'Topic 3 Detail',45,'Objectives for Unit 3','Scripted',NULL,NULL,NULL,NULL,NULL),(24,24,'Topic 4 Detail',45,'Objectives for Unit 4','Scripted',NULL,NULL,NULL,NULL,NULL),(25,25,'Topic 5 Detail',45,'Objectives for Unit 5','Scripted',NULL,NULL,NULL,NULL,NULL),(26,26,'Topic 1.1: Accounting Concepts',NULL,NULL,'Scripted',NULL,NULL,NULL,NULL,NULL),(27,25,'Topic 2.1: Double Entry System',NULL,NULL,'Scripted',NULL,NULL,NULL,NULL,NULL),(28,28,'Topic 1.1: Financial Statements',NULL,NULL,'Published',NULL,NULL,NULL,NULL,NULL),(29,30,'Topic 3.1: Analysis',NULL,NULL,'Under_Review',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `contentitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentscripts`
--

DROP TABLE IF EXISTS `contentscripts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contentscripts` (
  `script_id` int NOT NULL AUTO_INCREMENT,
  `content_id` int NOT NULL,
  `presentation_file_data` longblob,
  `materials_file_data` longblob,
  `introduction_script_url` text,
  `instructions_for_editor` text,
  PRIMARY KEY (`script_id`),
  UNIQUE KEY `content_id` (`content_id`),
  CONSTRAINT `contentscripts_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `contentitems` (`content_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentscripts`
--

LOCK TABLES `contentscripts` WRITE;
/*!40000 ALTER TABLE `contentscripts` DISABLE KEYS */;
INSERT INTO `contentscripts` VALUES (1,6,NULL,NULL,'U00V00 - Introduction to Digital Logic Design - Fabiola Hazel Pohrmen',NULL);
/*!40000 ALTER TABLE `contentscripts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `status` enum('Draft','Active','Archived') NOT NULL DEFAULT 'Draft',
  `content_folder_url` text,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `program_id` (`program_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1001,1,'FOUNDATIONAL MATHEMATICS','BCA-OL-101-1','Active','https://drive.google.com/drive/folders/1zl30HSGl6amPXcBUkKlEg7iuPsxQC1Bd?usp=drive_link'),(1002,1,'DIGITAL LOGIC DESIGN','BCA-OL-102-1','Active','DIGITAL LOGIC DESIGN- Fabiola Hazel Pohrmen...'),(1003,1,'PROGRAMMING USING C','BCA-OL-103-1','Active','https://drive.google.com/drive/folders/1vz2NMx4T5-Wof2xBiEFOVoQyhYNXh9wK?usp=drive_link'),(1004,1,'ACADEMIC WRITING','BCA-OL-104-1','Active','https://drive.google.com/drive/folders/1nIe8bc28...'),(1005,1,'INTERNET AND WEB TECHNOLOGY','BCA-OL-181-1','Active','https://drive.google.com/drive/folders/1jXE-dK17mTxscBEAQ62yzEGcvkUv69Xz?usp=sharing'),(2001,2,'Fundamentals of Accountancy','BCOM-NA-1','Active','https://drive.google.com/drive/folders/1k6je24tu8Gd0BYKWzKHgQYvdCum8dGLY'),(2002,2,'Communicative English - I','ENG 283-1','Active','https://drive.google.com/drive/u/1/folders/1lcZeqyN1i3AUcvw9SkpiBwYvc9TZr0ZO'),(2003,2,'Financial Accounting','COMO101-1','Active','https://drive.google.com/drive/folders/1NCTSTO0EyzhUrGs_rvWTqmVwoulivf1g?usp=sharing'),(2004,2,'Business Law','COMO102-1','Active','https://drive.google.com/drive/folders/1jZAjnJIhIXSpDBBX4iiRz8ftImS2EwtU?usp=drive_link'),(2005,2,'Principles of Management','COMO103-1','Active','https://drive.google.com/drive/folders/1sY1HZdcwvn9lpqtuwmWB-kaO81CIaV8s?usp=drive_link'),(2006,2,'Business Economics','COM 102','Active','https://drive.google.com/drive/folders/1WHLnI8-K-EiGV7HG2UGtOZOZJeRjnqXA?usp=sharing'),(2007,2,'Computerised Accounting*','COMO161-1','Active','https://drive.google.com/drive/folders/1bGUpoHNqLjum8Vs-YwvGWZMK_H4r_ryQ');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursesections`
--

DROP TABLE IF EXISTS `coursesections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursesections` (
  `section_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `order_index` int NOT NULL,
  PRIMARY KEY (`section_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `coursesections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursesections`
--

LOCK TABLES `coursesections` WRITE;
/*!40000 ALTER TABLE `coursesections` DISABLE KEYS */;
INSERT INTO `coursesections` VALUES (1,1001,'Unit 1',1),(2,1001,'Unit 2',2),(3,1001,'Unit 3',3),(4,1001,'Unit 4',4),(5,1001,'Unit 5',5),(6,1002,'Unit 1',1),(7,1002,'Unit 2',2),(8,1002,'Unit 3',3),(9,1002,'Unit 4',4),(10,1002,'Unit 5',5),(11,1003,'Unit 1',1),(12,1003,'Unit 2',2),(13,1003,'Unit 3',3),(14,1003,'Unit 4',4),(15,1003,'Unit 5',5),(16,1004,'Unit 1',1),(17,1004,'Unit 2',2),(18,1004,'Unit 3',3),(19,1004,'Unit 4',4),(20,1004,'Unit 5',5),(21,1005,'Unit 1',1),(22,1005,'Unit 2',2),(23,1005,'Unit 3',3),(24,1005,'Unit 4',4),(25,1005,'Unit 5',5),(26,2001,'Unit 1: Introduction',1),(27,2001,'Unit 2: Basics',2),(28,2003,'Unit 1',1),(29,2003,'Unit 2',2),(30,2003,'Unit 3',3);
/*!40000 ALTER TABLE `coursesections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursesemesters`
--

DROP TABLE IF EXISTS `coursesemesters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursesemesters` (
  `sem_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `semester_number` int NOT NULL,
  `year` year NOT NULL,
  PRIMARY KEY (`sem_id`),
  UNIQUE KEY `course_id` (`course_id`,`semester_number`,`year`),
  CONSTRAINT `coursesemesters_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursesemesters`
--

LOCK TABLES `coursesemesters` WRITE;
/*!40000 ALTER TABLE `coursesemesters` DISABLE KEYS */;
INSERT INTO `coursesemesters` VALUES (1,1001,1,2026),(2,1002,1,2026),(3,1003,1,2026),(4,1004,1,2026),(5,1005,1,2026),(6,2001,1,2026),(7,2002,1,2026),(8,2003,1,2026),(9,2004,1,2026),(10,2005,1,2026),(11,2006,1,2026),(12,2007,1,2026);
/*!40000 ALTER TABLE `coursesemesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `program_id` int NOT NULL AUTO_INCREMENT,
  `school_id` int NOT NULL,
  `program_name` varchar(255) NOT NULL,
  `program_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`program_id`),
  UNIQUE KEY `program_code` (`program_code`),
  KEY `school_id` (`school_id`),
  CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`school_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (1,1,'Bachelor of Computer Applications','BCA'),(2,2,'Bachelor of Commerce','BCOM');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `can_edit_courses` tinyint(1) NOT NULL DEFAULT '0',
  `can_manage_system` tinyint(1) NOT NULL DEFAULT '0',
  `can_upload_content` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin',1,1,1),(2,'Teacher',1,0,0),(3,'Editor',0,0,1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `school_id` int NOT NULL AUTO_INCREMENT,
  `school_name` varchar(255) NOT NULL,
  PRIMARY KEY (`school_id`),
  UNIQUE KEY `school_name` (`school_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (2,'School of Management'),(1,'School of Science');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unitmaterials`
--

DROP TABLE IF EXISTS `unitmaterials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unitmaterials` (
  `material_id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `filename` varchar(512) NOT NULL,
  `file_path` text NOT NULL COMMENT 'Absolute or relative path on disk',
  `file_type` varchar(100) DEFAULT NULL COMMENT 'ppt, pdf, docx, image, etc',
  `uploaded_by` int DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`material_id`),
  KEY `section_id` (`section_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `unitmaterials_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `coursesections` (`section_id`) ON DELETE CASCADE,
  CONSTRAINT `unitmaterials_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unitmaterials`
--

LOCK TABLES `unitmaterials` WRITE;
/*!40000 ALTER TABLE `unitmaterials` DISABLE KEYS */;
/*!40000 ALTER TABLE `unitmaterials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercourseassignment`
--

DROP TABLE IF EXISTS `usercourseassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercourseassignment` (
  `user_course_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`user_course_id`),
  UNIQUE KEY `user_id` (`user_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `usercourseassignment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `usercourseassignment_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercourseassignment`
--

LOCK TABLES `usercourseassignment` WRITE;
/*!40000 ALTER TABLE `usercourseassignment` DISABLE KEYS */;
INSERT INTO `usercourseassignment` VALUES (1,1,1001),(2,2,1001),(3,3,1002),(4,4,1002),(5,5,1003),(6,6,1003),(7,7,1004),(8,8,1004),(9,9,1005),(10,10,1005),(11,11,2001),(12,12,2002),(13,13,2003),(14,14,2003),(15,15,2004),(16,16,2004),(17,17,2005),(18,18,2005),(19,19,2006),(20,20,2006),(21,21,2007),(22,22,2007);
/*!40000 ALTER TABLE `usercourseassignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,2,'jkaspar@clg.edu','hash','John','Kaspar'),(2,2,'k_r@clg.edu','hash','Krishnendu R',''),(3,2,'rohiniv@clg.edu','hash','Rohini','V'),(4,2,'fpohrmen@clg.edu','hash','Fabiola Hazel','Pohrmen'),(5,2,'chanti@clg.edu','hash','Chanti',''),(6,2,'sreeja@clg.edu','hash','Sreeja',''),(7,2,'daniel@clg.edu','hash','Daniel',''),(8,2,'christina@clg.edu','hash','Christina',''),(9,2,'logeswaran@clg.edu','hash','Logeswaran',''),(10,2,'sangeetha@clg.edu','hash','Sangeetha',''),(11,2,'michaelz@clg.edu','hash','Michael','Zimik'),(12,2,'sreejithd@clg.edu','hash','Sreejith','D'),(13,2,'natchimuthun@clg.edu','hash','Natchimuthu','N'),(14,2,'veertatantia@clg.edu','hash','Veerta','Tantia'),(15,2,'naveenk@clg.edu','hash','Naveen Kumara','N'),(16,2,'shaerilm@clg.edu','hash','Shaeril Michael','Almeida'),(17,2,'rishikesb@clg.edu','hash','Rishikesh','B'),(18,2,'maryranit@clg.edu','hash','Mary Rani','Thomas'),(19,2,'manojmorais@clg.edu','hash','Manoj','Morais'),(20,2,'anuradhab@clg.edu','hash','Anuradha','Buddha'),(21,2,'smitak@clg.edu','hash','Smita','Kavatekar'),(22,2,'gowthamr@clg.edu','hash','Gowtham','R');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 15:23:51
