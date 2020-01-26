SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS account_recovery;
DROP TABLE IF EXISTS verify_email;
DROP TABLE IF EXISTS session_ids;
DROP TABLE IF EXISTS notes_text;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS messages_text;
DROP TABLE IF EXISTS messages;
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
  university_id INT(11) NOT NULL,
  is_admin TINYINT(1) NOT NULL,
  privacy TINYINT(1) NOT NULL,
  email_verified TINYINT(1) NOT NULL,
  FOREIGN KEY (university_id) REFERENCES university(id)
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

CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  creation_date DATE NOT NULL,
  account_id VARCHAR(40) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS notes_text (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  notes LONGTEXT,
  FOREIGN KEY (id) REFERENCES notes(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  from_account VARCHAR(40) NOT NULL,
  to_account VARCHAR(40) NOT NULL,
  creation_date DATE NOT NULL,
  FOREIGN KEY (from_account) REFERENCES users(id),
  FOREIGN KEY (to_account) REFERENCES users(id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS messages_text (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  message LONGTEXT,
  FOREIGN KEY (id) REFERENCES messages(id)
) ENGINE = INNODB;

INSERT INTO university (university_name, university_website, server_address, contact_name, contact_email) VALUES ('Locked', '', '1.1.1.1.1', 'Matthew Frankland', 'mf48@hw.ac.uk');

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
