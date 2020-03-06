<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

class dbOperation {

    private $conn;

    function __construct () {

        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';

        $db = new DbConnect();
        $this->conn = $db->connect();

    }

  /**
   *
   * XSS Protection
   *
   */
    public function noHTML ($input, $encoding = 'UTF-8') {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, $encoding);
    }

  /**
   *
   * Get All Lecturers At Administrators University
   *
   */
    public function getLecturers ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($administrator);
        $stmt->fetch();

        if ($administrator == 1) {

          $stmt = $this->conn->prepare('SELECT `surname`, `forename`, `email`, (SELECT `university_name` FROM `university` WHERE `id`=u.`university_id`) AS `university` FROM `users` u WHERE `is_lecturer`=1 AND `university_id` = (SELECT `university_id` FROM `users` WHERE `id`=?)');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          return $res;

        } else {

          return -2;

        }

      } else {

        return -1;

      }

    }

  /**
   *
   * Get All Users Of System At Administrators University
   *
   */
    public function getUsers ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($administrator);
        $stmt->fetch();

        if ($administrator == 1) {

          $stmt = $this->conn->prepare('SELECT `id`, `surname`, `forename`, `email` FROM `users` u WHERE `university_id` = (SELECT `university_id` FROM `users` WHERE `id`=?)');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          return $res;

        } else {

          return -2;

        }

      } else {

        return -1;

      }

    }

  /**
   *
   * Delete A Class From The System
   *
   */
    public function deleteClass ($sessionid, $classID) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($administrator);
        $stmt->fetch();

        if ($administrator == 1) {

          $stmt = $this->conn->prepare('SELECT `class_name` FROM `classes` WHERE `id`=?;');
          $stmt->bind_param('s', $classID);
          $stmt->execute();
          $stmt->store_result();

          if ($stmt->num_rows > 0) {

            $stmt = $this->conn->prepare('DELETE FROM `classes` WHERE `id`=?;');
            $stmt->bind_param('s', $classID);

            if ($stmt->execute()) {

              $stmt = $this->conn->prepare('DELETE FROM `calendar_events` WHERE `class_id`=?;');
              $stmt->bind_param('s', $classID);

              if ($stmt->execute()) {

                $stmt = $this->conn->prepare('DELETE FROM `board` WHERE `class_id`=?;');
                $stmt->bind_param('s', $classID);

                if ($stmt->execute()) {

                  $stmt = $this->conn->prepare('DELETE FROM `student_classes` WHERE `class_id`=?;');
                  $stmt->bind_param('s', $classID);

                  if ($stmt->execute()) {

                    return true;

                  } else {

                    return -4;

                  }

                } else {

                  return -4;

                }

              } else {

                return -4;

              }

            } else {

              return -4;

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

  /**
   *
   * Delete Message Threads, Messages, and Message Text Associated With A Given Thread ID
   *
   */
    public function deleteMessages ($threadid) {
      $stmt = $this->conn->prepare('SELECT `id` FROM `messages` WHERE `message_thread`=?;');
      $stmt->bind_param('s', $threadid);
      $stmt->execute();
      $result = $stmt->get_result();
      $res = array();

      while ($data = $result->fetch_assoc()) {

          array_push($res, $data);

      }

      foreach ($res as $data) {

        $stmt = $this->conn->prepare('DELETE FROM `messages_text` WHERE `id`=?;');
        $stmt->bind_param('s', $data['id']);

        if (! $stmt->execute()) {

          return -3;

        }

      }

      $stmt = $this->conn->prepare('DELETE FROM `messages` WHERE `message_thread`=?;');
      $stmt->bind_param('s', $threadid);

      if ($stmt->execute()) {

        $stmt = $this->conn->prepare('DELETE FROM `message_threads` WHERE `thread_id`=?;');
        $stmt->bind_param('s', $threadid);


        if ($stmt->execute()) {

          return true;

        } else {

          return -3;

        }

      } else {

        return -3;

      }
    }

  /**
   *
   * Delete A User From The System And All Associated Data
   *
   */
    public function deleteUser ($sessionid, $userID) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($administrator);
        $stmt->fetch();

        if ($administrator == 1) {

          $stmt = $this->conn->prepare('SELECT `id` FROM `users` WHERE `id`=?;');
          $stmt->bind_param('s', $userID);
          $stmt->execute();
          $stmt->store_result();

          if ($stmt->num_rows > 0) {

            $stmt = $this->conn->prepare('SELECT `thread_id` FROM `message_threads` c WHERE `originating_user` = ? OR `recipient_user` = ?;');
            $stmt->bind_param('ss', $userID, $userID);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($data = $result->fetch_assoc()) {

              if ( $this->deleteMessages($data["thread_id"]) != true ) {

                return -4;

              }

            }

            $stmt = $this->conn->prepare('SELECT `id` FROM `notes` c WHERE `account_id` = ?;');
            $stmt->bind_param('s', $userID);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($data = $result->fetch_assoc()) {

              $stmt = $this->conn->prepare('DELETE FROM `notes_text` WHERE `id`=?;');
              $stmt->bind_param('s', $data["id"]);

              if ($stmt->execute() != true) {

                return -4;

              }

            }

            $stmt = $this->conn->prepare('DELETE FROM `notes` WHERE `account_id`=?;');
            $stmt->bind_param('s', $userID);

            if ($stmt->execute()) {

              $stmt = $this->conn->prepare('DELETE FROM `session_ids` WHERE `account_id`=?;');
              $stmt->bind_param('s', $userID);

              if ($stmt->execute()) {

                $stmt = $this->conn->prepare('SELECT `id` FROM `classes` WHERE `lecturer` = ?;');
                $stmt->bind_param('s', $userID);
                $stmt->execute();
                $result = $stmt->get_result();

                while ($data = $result->fetch_assoc()) {

                  if ($this->deleteClass($sessionid, $data["id"]) != true) {

                    return -4;

                  }

                }

                $stmt = $this->conn->prepare('DELETE FROM `users` WHERE `id`=?;');
                $stmt->bind_param('s', $userID);

                if ($stmt->execute()) {

                  return true;

                } else {

                  return -4;

                }

              } else {

                return -4;

              }

            } else {

              return -4;

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

  /**
   *
   * Get All Classes At An Administrators University
   *
   */
    public function getClasses ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($administrator);
        $stmt->fetch();

        if ($administrator == 1) {

          $stmt = $this->conn->prepare('SELECT `id`, `class_name`, `class_code`, (SELECT `forename` FROM `users` WHERE `id`=c.`lecturer`) AS `lecturer_forename`, (SELECT `surname` FROM `users` WHERE `id`=c.`lecturer`) AS `lecturer_surname`, (SELECT `university_name` FROM `university` WHERE `id`=`university_id`) AS `university` FROM `classes` c WHERE `university_id` = (SELECT `university_id` FROM `users` WHERE `id`=?);');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          return $res;

        } else {

          return -2;

        }

      } else {

        return -1;

      }

    }

  /**
   *
   * Register A New Class In The System
   *
   */
    public function classRegister($sessionid, $classname, $classcode, $lectureremail, $uid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($administrator);
        $stmt->fetch();

        if ($administrator == 1) {

          if ($this->isUserExist($lectureremail)) {

            $stmt = $this->conn->prepare('SELECT `lecturer` FROM `classes` WHERE `lecturer`=(SELECT `id` FROM `users` WHERE `email`=?);');
            $stmt->bind_param('s', $lectureremail);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows <= 3 && $stmt->num_rows >= 0) {

              $classname .= ' (' . date("Y") . ')';
              $stmt = $this->conn->prepare('INSERT INTO `classes` (`id`, `class_name`, `class_code`, `university_id`, `lecturer`, `date_associated`) VALUES (UUID(), ?, ?, ?, (SELECT `id` FROM `users` WHERE `email`=?), CURDATE());');
              $stmt->bind_param('ssss', $classname, $classcode, $uid, $lectureremail);

              if ($stmt->execute()) {

                return true;

              } else {

                return -5;

              }

            } else {

              return -4;

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

  /**
   *
   * Check That The Current Session Is Valid
   *
   */
    public function checkValid ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_admin` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($admin);
        $stmt->fetch();

        if ($admin == 1) {

          return true;

        } else {

          return -2;

        }

      } else {

        return -1;

      }

    }

  /**
   *
   * Get The Account ID Associated With A Session
   *
   */
    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param('s', $sessionid);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id);
        $stmt->fetch();
        return $id;

    }

  /**
   *
   * Check A Given Email Is Not Already Registered In The System
   *
   */
    private function isUserExist ($email) {

        $stmt = $this->conn->prepare('SELECT `id` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        return $stmt->num_rows > 0;

    }

}

?>
