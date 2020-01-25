<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

class dbOperation {

    private $conn;

    function __construct () {

        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';

        $db = new DbConnect ();
        $this->conn = $db->connect ();

    }

    public function noHTML ($input, $encoding = 'UTF-8') {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, $encoding);
    }

    public function userLogin ($email, $pass) {

        $stmt = $this->conn->prepare ('SELECT `pass` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->store_result();
        $stmt->bind_result ($password);
        $stmt->fetch();

        if ( password_verify($pass, $password) ) {
          $code = md5(uniqid(mt_rand()));
          $id = $this->getID($email);
          $stmt = $this->conn->prepare('INSERT INTO `session_ids` (`code`, `account_id`, `time_stamp`) VALUES (?, ?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
          $stmt->bind_param('sss', $code, $id, $code);
          $stmt->execute();
          return $code;
        }

        return false;

    }

    public function getEmailValid ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `email_verified` FROM `users` WHERE `id`=?;');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
          $stmt->bind_result ($emailVerified);
          $stmt->fetch();

          if ($emailVerified == 0) {

            return false;

          }

          return true;

        } else {

          return -1;

        }

    }

    public function getNotes ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id`, `title`, `creation_date` FROM `notes` WHERE `account_id`=?;');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          return $res;

        } else {

          return -1;

        }

    }

    public function getNote ($sessionid, $noteid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id` FROM `notes` WHERE `account_id`=? AND `id`=?;');
          $stmt->bind_param ('ss', $id, $noteid);
          $stmt->execute ();
          $stmt->store_result();
          $stmt->bind_result ($note);
          $stmt->fetch();

          if ($note === $noteid) {
            $stmt = $this->conn->prepare ('SELECT `notes` FROM `notes_text` WHERE `id`=?;');
            $stmt->bind_param ('s', $noteid);
            $stmt->execute ();
            $stmt->store_result();
            $stmt->bind_result ($notetext);
            $stmt->fetch();

            if ($notetext == null) {
              return '';
            } else {
              return $notetext;
            }

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function deleteNote ($sessionid, $noteid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id` FROM `notes` WHERE `account_id`=? AND `id`=?;');
          $stmt->bind_param ('ss', $id, $noteid);
          $stmt->execute ();
          $stmt->store_result();
          $stmt->bind_result ($note);
          $stmt->fetch();

          if ($note === $noteid) {

            $stmt = $this->conn->prepare ('DELETE FROM `notes_text` WHERE `id`=?;');
            $stmt->bind_param ('s', $noteid);

            if ( $stmt->execute () ) {

              $stmt = $this->conn->prepare ('DELETE FROM `notes` WHERE `id`=?;');
              $stmt->bind_param ('s', $noteid);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -3;

              }

            } else {

              return -3;

            }

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function saveNote ($sessionid, $noteID, $noteText) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ( 'INSERT INTO `notes_text` ( `id`, `notes` ) VALUES (?, ?) ON DUPLICATE KEY UPDATE `notes`=?;' );
          $stmt->bind_param ('sss', $noteID, $noteText, $noteText);

          if ( $stmt->execute () ) {

            return true;

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function newNote ($sessionid, $noteTitle) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ( 'INSERT INTO `notes` ( `id`, `title`, `creation_date`, `account_id` ) VALUES (UUID(), ?, CURDATE(), ?);' );
          $stmt->bind_param ('ss', $noteTitle, $id);

          if ( $stmt->execute () ) {

            return true;

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function getEducationValid ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `university_id` FROM `users` WHERE `id`=?;');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
          $stmt->bind_result ($educationVerified);
          $stmt->fetch();

          if ($educationVerified == 1) {

            return false;

          }

          return true;

        } else {

          return -1;

        }

    }

    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare ('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param ('s', $sessionid);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function getID ($email) {

        $stmt = $this->conn->prepare ('SELECT `id` FROM `users` WHERE `email`=?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function getAccount ($email) {
        $stmt = $this->conn->prepare ('SELECT `surname`, `forename`, `profile_pic_link`, `email`, `university_id`, `is_admin`, `email_verified` FROM `users` WHERE `email`=?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $result = $stmt->get_result();
        $res = array();

        while ($data = $result->fetch_assoc()) {

            array_push($res, $data);

        }

        return $res;
    }

    public function isAdmin ($email) {

        $stmt = $this->conn->prepare ('SELECT `is_admin` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->store_result();
        $stmt->bind_result ($admin);
        $stmt->fetch();
        return $admin;

    }

    public function updateProfile ($sessionid, $forename, $surname, $email, $profilePicLink) {

      $id = $this->getAccountID($sessionid);

      if ( $profilePicLink == '' ) {

        $profilePicLink = NULL;

      }

      if ( $id != NULL ) {

        if ( $email === '' ) {

          if ( $forename === '' ) {

            if ( $surname !== '' ) {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `surname` = ?, `profile_pic_link` = ?;');
              $stmt->bind_param ('ss', $surname, $profilePicLink);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -2;

              }

            }

          } else {

            if ( $surname === '' ) {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `forename` = ?, `profile_pic_link` = ?;');
              $stmt->bind_param ('ss', $forename, $profilePicLink);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -2;

              }

            } else {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `surname` = ?, `forename`=?, `profile_pic_link` = ?;');
              $stmt->bind_param ('sss', $surname, $forename, $profilePicLink);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -2;

              }

            }

          }

        } else {

          if ( $forename === '' ) {

            if ( $surname === '' ) {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `email_verified` = 0, `profile_pic_link` = ?;');
              $stmt->bind_param ('ss', $email, $profilePicLink);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            } else {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = ?;');
              $stmt->bind_param ('sss', $email, $surname, $profilePicLink);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            }

          } else {

            if ( $surname === '' ) {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `forename` = ?, `email_verified` = 0, `profile_pic_link` = ?;');
              $stmt->bind_param ('sss', $email, $forename, $profilePicLink);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            } else {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `forename`=?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = ?;');
              $stmt->bind_param ('ssss', $email, $forename, $surname, $profilePicLink);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            }

          }

        }

      } else {

        return -1;

      }

    }

    public function createUser ($email, $pass) {

        if (!$this->isUserExist ($email)) {

            $options = ['cost' => 12,];
            $password = password_hash($pass, PASSWORD_BCRYPT, $options);
            $stmt = $this->conn->prepare ('INSERT INTO `users` (`id`, `surname`, `forename`, `profile_pic_link`, `email`, `pass`, `university_id`, `is_admin`, `email_verified`) VALUES (UUID(), NULL, NULL, NULL, ?, ?, 1, false, false);');
            $stmt->bind_param ('ss', $email, $password);

            if ($stmt->execute ()) {

                if ($this->verificationEmail($email)) {

                  $code = md5(uniqid(mt_rand()));

                  $id = $this->getID($email);
                  $stmt = $this->conn->prepare('INSERT INTO `session_ids` (`code`, `account_id`, `time_stamp`) VALUES (?, ?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
                  $stmt->bind_param('sss', $code, $id, $code);
                  $stmt->execute();

                  return $code;

                }

            } else {

                return -2;

            }

        } else {

            return -1;

        }

    }

    public function verificationEmail ($email) {

      $code = md5(uniqid(mt_rand()));
      $uniqueLink = 'https://www.matthewfrankland.co.uk/dissertation/confirmEmail/emailConfirm.php?code='.$code.'&email='.$email;

      $subject = 'Email Confirmation => Higher Education Study Planner';
      $headers = 'MIME-Version: 1.0' . "\r\n";
      $headers .= 'Content-type:text/html;charset=UTF-8' . "\r\n";
      $headers .= 'From: StudyPlanner<noreply@studyplanner.com>' . "\r\n";
      $mailContent = 'Thank you for creating an account with the Higher Education Study Planner App. If this was a mistake or you did not request this email, please destroy this email without any further action.<br/>To verify your email, visit the following link: <a href="'.$uniqueLink.'">'.$uniqueLink.'</a><br/><br/>Regards,<br/>HE Study Planner Team';

      $stmt = $this->conn->prepare('INSERT INTO `verify_email` VALUES (?, UNIX_TIMESTAMP());');
      $stmt->bind_param('s', $code);
      $stmt->execute();
      mail($email,$subject,$mailContent,$headers);

      return true;

    }

    public function resetPass ($email) {

        if ($this->isUserExist ($email)) {

            $code = md5(uniqid(mt_rand()));
            $uniqueLink = 'https://www.matthewfrankland.co.uk/dissertation/resetPass/passwordRecovery.php?code='.$code.'&email='.$email;

            $subject = 'Password Update Request => Higher Education Study Planner';
            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type:text/html;charset=UTF-8' . "\r\n";
            $headers .= 'From: StudyPlanner<noreply@studyplanner.com>' . "\r\n";
            $mailContent = 'Recently a request was submitted to reset a password for your account. If this was a mistake or you did not request this email, please destroy this email without any further action.<br/>To reset your password, visit the following link: <a href="'.$uniqueLink.'">'.$uniqueLink.'</a><br/><br/>Regards,<br/>HE Study Planner Team';

            $id = $this->getID($email);
            $stmt = $this->conn->prepare('INSERT INTO `session_ids` (`code`, `account_id`, `time_stamp`) VALUES (?, ?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
            $stmt->bind_param('sss', $code, $id, $code);
            $stmt->execute();

            mail($email,$subject,$mailContent,$headers);

            return true;

        } else {

            return false;

        }

    }

    private function isUserExist ($email) {

        $stmt = $this->conn->prepare('SELECT `id` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        return $stmt->num_rows > 0;

    }

}

?>
