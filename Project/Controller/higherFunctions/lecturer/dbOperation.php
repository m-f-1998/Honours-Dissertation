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
   * Get All Students Associated With Lecturer
   *
   */
    public function getStudents ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('SELECT `surname`, `forename`, `email`, `privacy`, (SELECT `class_name` FROM `classes` WHERE `id`=sc.`class_id` AND `lecturer`=?) AS `class`, (SELECT `university_name` FROM `university` WHERE `id`=u.`university_id`) AS `university` FROM `users` u, `student_classes` sc WHERE u.`id` = sc.`student_id` AND u.`university_id` != 1 HAVING `class` IS NOT NULL ORDER BY `class`');
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
   * Get All Classes That Lecturer Teaches
   *
   */
    public function getClasses ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          $stmt = $this->conn->prepare('SELECT `class_name` FROM `classes` WHERE `lecturer`=?');
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
   * Check Session Is Valid
   *
   */
    public function checkValid ($sessionid) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

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

  /**
   *
   * Check Users Email Is Not Already Registered
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
