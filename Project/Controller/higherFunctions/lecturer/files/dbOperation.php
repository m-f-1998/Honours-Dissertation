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
   * Store A Link To A Class Document That Lecturer Has Passed
   *
   */
    public function uploadFile ($sessionid, $title, $link, $class) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('INSERT INTO `board` (`id`, `class_id`, `title`, `link`) VALUES (UUID(), (SELECT `id` FROM `classes` WHERE `class_name`=?), ?, ?);');
          $stmt->bind_param('sss', htmlspecialchars_decode($class), $title, $link);

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
   * Update An Exiting File
   *
   */
    public function updateFile ($sessionid, $title, $link, $class, $file_id) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('UPDATE `board` SET `class_id`=(SELECT `id` FROM `classes` WHERE `class_name`=?), `title`=?, `link`=? WHERE `id`=?;');
          $stmt->bind_param('ssss', htmlspecialchars_decode($class), $title, $link, $file_id);

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
   * Get All Files Associated With A Lecturer Based On Their Current Session
   *
   */
    public function getFiles ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('SELECT (SELECT `class_name` FROM `classes` WHERE `id` = b.`class_id`) AS `class`, `title`, `link`, `id` FROM `board` b WHERE (SELECT `lecturer` FROM `classes` WHERE `id` = b.`class_id`)=? ORDER BY `class`');
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
   * Get All Information Associated With A Passed File
   *
   */
    public function getFileInfo ($sessionid, $file_id) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('SELECT (SELECT `class_name` FROM `classes` WHERE `id` = b.`class_id`) AS `class`, `id`, `title`, `link` FROM `board` b WHERE `id`=?');
          $stmt->bind_param('s', $file_id);
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
   * Delete A Passed File If User Is A Lecturer
   *
   */
    public function deleteFile ($sessionid, $file_id) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('DELETE FROM `board` WHERE `id`=?;');
          $stmt->bind_param('s', $file_id);

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
