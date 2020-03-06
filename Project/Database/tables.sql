SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS account_recovery;
DROP TABLE IF EXISTS verify_email;
DROP TABLE IF EXISTS session_ids;
DROP TABLE IF EXISTS education_ids;
DROP TABLE IF EXISTS notes_text;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS messages_text;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS message_threads;
DROP TABLE IF EXISTS board;
DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS student_classes;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS university;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE IF NOT EXISTS university (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  university_name VARCHAR(100) NOT NULL UNIQUE,
  university_website VARCHAR(100),
  server_address VARCHAR(100) NOT NULL UNIQUE,
  contact_name VARCHAR (100) NOT NULL,
  contact_email VARCHAR(50) NOT NULL
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  surname VARCHAR(50),
  forename VARCHAR(50),
  profile_pic_link VARCHAR(400),
  email VARCHAR(50) NOT NULL UNIQUE,
  pass VARCHAR(150) NOT NULL,
  push_token VARCHAR(150) NOT NULL,
  push_allowed TINYINT(1) NOT NULL,
  university_id INT(11) NOT NULL,
  is_lecturer TINYINT(1) NOT NULL,
  is_admin TINYINT(1) NOT NULL,
  privacy TINYINT(1) NOT NULL,
  email_verified TINYINT(1) NOT NULL,
  FOREIGN KEY (university_id) REFERENCES university(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  class_name VARCHAR(100) NOT NULL UNIQUE,
  class_code VARCHAR(100) NOT NULL,
  university_id INT(11) NOT NULL,
  lecturer VARCHAR(40) NOT NULL,
  date_associated DATE NOT NULL,
  FOREIGN KEY (university_id) REFERENCES university(id),
  FOREIGN KEY (lecturer) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS student_classes (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  class_id VARCHAR(40) NOT NULL,
  student_id VARCHAR(40) NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS calendar_events (
  id VARCHAR(200) PRIMARY KEY,
  class_id VARCHAR(40) NOT NULL,
  title VARCHAR(100) NOT NULL,
  date_due DATE NOT NULL,
  time_due TIME NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS board (
  id VARCHAR(200) PRIMARY KEY,
  class_id VARCHAR(40) NOT NULL,
  title VARCHAR(100) NOT NULL,
  link VARCHAR(100) NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS account_recovery (
  code VARCHAR(200) PRIMARY KEY,
  time_stamp INT(11) NOT NULL
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS verify_email (
  code VARCHAR(200) PRIMARY KEY,
  time_stamp INT(11) NOT NULL
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS session_ids (
  account_id VARCHAR(40) NOT NULL PRIMARY KEY,
  code VARCHAR(200) NOT NULL,
  time_stamp INT(11) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS education_ids (
  code VARCHAR(200) NOT NULL PRIMARY KEY,
  uni_id INT(11) NOT NULL,
  time_stamp INT(11) NOT NULL,
  FOREIGN KEY (uni_id) REFERENCES university(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  creation_date DATE NOT NULL,
  creation_time TIME NOT NULL,
  account_id VARCHAR(40) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS notes_text (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  notes LONGTEXT,
  FOREIGN KEY (id) REFERENCES notes(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS message_threads (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  thread_id VARCHAR(40) NOT NULL,
  originating_user VARCHAR(40) NOT NULL,
  recipient_user VARCHAR(40) NOT NULL,
  FOREIGN KEY (originating_user) REFERENCES users(id),
  FOREIGN KEY (recipient_user) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  message_thread VARCHAR(40) NOT NULL,
  from_account VARCHAR(40) NOT NULL,
  to_account VARCHAR(40) NOT NULL,
  creation_date DATE NOT NULL,
  creation_time TIME NOT NULL,
  FOREIGN KEY (from_account) REFERENCES users(id),
  FOREIGN KEY (to_account) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS messages_text (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  message LONGTEXT,
  FOREIGN KEY (id) REFERENCES messages(id)
) ENGINE = INNODB;

INSERT INTO `university` (`university_name`, `university_website`, `server_address`, `contact_name`, `contact_email`) VALUES ('Locked', '', '1.1.1.1.1', 'Matthew Frankland', 'mf48@hw.ac.uk');
INSERT INTO `university` (`university_name`, `university_website`, `server_address`, `contact_name`, `contact_email`) VALUES ('Heriot-Watt University', '', '2.2.2.2.2', 'Matthew Frankland', 'mf48@hw.ac.uk');
INSERT INTO `university` (`university_name`, `university_website`, `server_address`, `contact_name`, `contact_email`) VALUES ('The University of Edinburgh', '', '3.3.3.3.3', 'Matthew Frankland', 'mf48@hw.ac.uk');
INSERT INTO `university` (`university_name`, `university_website`, `server_address`, `contact_name`, `contact_email`) VALUES ('Edinburgh Napier University', '', '4.4.4.4.4', 'Matthew Frankland', 'mf48@hw.ac.uk');
/* For Purposes Of This Exemplar Insert UUID Is Fixed For Lecturers */
INSERT INTO `users`(`id`, `surname`, `forename`, `profile_pic_link`, `email`, `pass`, `university_id`, `is_lecturer`, `privacy`, `email_verified`, `push_token`, `push_allowed`) VALUES ('3fd5d385-482b-11ea-b54c-232a6b9bc81a','Lemon','Oliver',NULL,'testLecturer@test.com','',2,1,1,1,'',0);
INSERT INTO `users`(`id`, `surname`, `forename`, `profile_pic_link`, `email`, `pass`, `university_id`, `is_lecturer`, `privacy`, `email_verified`, `push_token`, `push_allowed`) VALUES ('97b45b11-482b-11ea-b54c-232a6b9bc81a','Bartie','Phil',NULL,'testLecturer1@test.com','',2,1,1,1,'',0);
INSERT INTO `classes`(`id`, `class_name`, `class_code`, `university_id`, `lecturer`) VALUES (UUID(), 'Con Agents & Spoken Lang Proc', 'F20CA', 2, '3fd5d385-482b-11ea-b54c-232a6b9bc81a');
INSERT INTO `classes`(`id`, `class_name`, `class_code`, `university_id`, `lecturer`) VALUES (UUID(), 'Big Data', 'F20BD', 2, '97b45b11-482b-11ea-b54c-232a6b9bc81a');

DROP EVENT IF EXISTS `delete-confirm`;
CREATE EVENT `delete-confirm`
  ON SCHEDULE EVERY 1 HOUR
  STARTS '2020-01-18 14:52:58'
  ON COMPLETION PRESERVE
DO
  DELETE FROM `verify_email` WHERE `time_stamp` < (UNIX_TIMESTAMP() - 3600);

DROP EVENT IF EXISTS `delete-reset`;
CREATE EVENT `delete-reset`
  ON SCHEDULE EVERY 1 HOUR
  STARTS '2020-01-18 14:52:58'
  ON COMPLETION PRESERVE
DO
  DELETE FROM `account_recovery` WHERE `time_stamp` < (UNIX_TIMESTAMP() - 3600);

DROP EVENT IF EXISTS `delete-session`;
CREATE EVENT `delete-session`
  ON SCHEDULE EVERY 4 HOUR
  STARTS '2020-01-18 14:52:58'
  ON COMPLETION PRESERVE
DO
  DELETE FROM `session-ids` WHERE `time_stamp` < (UNIX_TIMESTAMP() - 3600);

DROP EVENT IF EXISTS `delete-education`;
CREATE EVENT `delete-education`
  ON SCHEDULE EVERY 1 HOUR
  STARTS '2020-01-18 14:52:58'
  ON COMPLETION PRESERVE
DO
  DELETE FROM `education_ids` WHERE `time_stamp` < (UNIX_TIMESTAMP() - 3600);

DROP EVENT IF EXISTS `delete-events`;
CREATE EVENT `delete-events`
  ON SCHEDULE EVERY 24 HOUR
  STARTS '2020-01-18 14:52:58'
  ON COMPLETION PRESERVE
DO
  DELETE FROM `calendar_events` WHERE `date_due` < CURDATE() OR `time_due` < CURTIME();

DROP EVENT IF EXISTS `dissasociate-lecturers`;
CREATE EVENT `dissasociate-lecturers`
  ON SCHEDULE EVERY 1 MONTH
  STARTS '2020-01-01 00:00:00'
  ON COMPLETION PRESERVE
DO
  UPDATE `classes` SET `lecturer`='' WHERE `date_associated` < YEAR(CURDATE() - INTERVAL 1 YEAR);

DROP EVENT IF EXISTS `delete-classes`;
CREATE EVENT `delete-classes`
  ON SCHEDULE EVERY 1 MONTH
  STARTS '2020-01-01 00:00:00'
  ON COMPLETION PRESERVE
DO
  DELETE FROM `classes` WHERE `date_associated` < YEAR(CURDATE() - INTERVAL 4 YEAR);
