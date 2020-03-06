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
   * Got All Calendar Events Associated With A User Based On Their Current Session
   *
   */
    public function getEvents ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('SELECT (SELECT `class_name` FROM `classes` WHERE `id` = e.`class_id`) AS `class`, `title`, `date_due`, `time_due`, `id` FROM `calendar_events` e WHERE (SELECT `lecturer` FROM `classes` WHERE `id` = e.`class_id`)=? ORDER BY `class`');
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
   * Delete A Passed Calendar Event Associated With A User Based On Their Current Session
   *
   */
    public function deleteEvent ($sessionid, $event_id) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('DELETE FROM `calendar_events` WHERE `id`=?;');
          $stmt->bind_param('s', $event_id);

          if ($stmt->execute()) {

            return true;

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
   * Get All Info Associated With A Passed Calendar Event
   *
   */
    public function getEventInfo ($sessionid, $event_id) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('SELECT (SELECT `class_name` FROM `classes` WHERE `id` = e.`class_id`) AS `class`, `title`, `date_due`, `time_due`, `id` FROM `calendar_events` e WHERE `id`=?');
          $stmt->bind_param('s', $event_id);
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
   * Add An Event To A Classes Calendar If User Is Lecturer
   *
   */
    public function addEvent ($sessionid, $title, $due, $class) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $date = explode("T", $due);

          $stmt = $this->conn->prepare('INSERT INTO `calendar_events` (`id`, `class_id`, `title`, `date_due`, `time_due`) VALUES (UUID(), (SELECT `id` FROM `classes` WHERE `class_name`=?), ?, ?, ?);');
          $stmt->bind_param('ssss', htmlspecialchars_decode($class), $title, $date[0], $date[1]);

          if ($stmt->execute()) {

            return true;

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
   * Update An Exisiting Event
   *
   */
    public function updateEvent ($sessionid, $title, $due, $class, $event_id) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {
          $date = explode("T", $due);

          $stmt = $this->conn->prepare('UPDATE `calendar_events` SET `class_id`=(SELECT `id` FROM `classes` WHERE `class_name`=?), `title`=?, `date_due`=?, `time_due`=? WHERE `id`=?;');
          $stmt->bind_param('sssss', htmlspecialchars_decode($class), $title, $date[0], $date[1], $event_id);

          if ($stmt->execute()) {

            return true;

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
   * Get Account ID From Session
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

}

?>
