<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

class dbOperation {

    private $conn;

    function __construct () {

        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';
        require_once __DIR__.'/../../vendor/autoload.php';

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
   * Get Current Users ID For A Session
   *
   */
    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param('s', $sessionid);
        $stmt->execute();
        $stmt->bind_result($id);
        $stmt->fetch();
        return $id;

    }

  /**
   *
   * Get Classes A Student Is Currently Registered To
   *
   */
    public function getClasses ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT `class_id` FROM `student_classes` WHERE `student_id`=?;');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

            $statementTwo = $this->conn->prepare('SELECT `class_name`, `class_code`,
              (SELECT `users`.`forename` FROM `users` WHERE `users`.`id` = `classes`.`lecturer`) AS `forename_lecturer`,
              (SELECT `users`.`surname` FROM `users` WHERE `users`.`id` = `classes`.`lecturer`) AS `forename_surname`
            FROM `classes` WHERE `id`=?;');
            $statementTwo->bind_param('s', $data["class_id"]);
            $statementTwo->execute();
            $resultTwo = $statementTwo->get_result();

            while ($return = $resultTwo->fetch_assoc()) {

                array_push($res, $return);

            }

          }

          return $res;

        } else {

          return -1;

        }

    }

  /**
   *
   * Get All Events In Student's Passed Classes
   *
   */
    public function getEvents ($sessionid, $classCodes) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $res = array();

        foreach (json_decode(htmlspecialchars_decode($classCodes)) as $code) {

          $stmt = $this->conn->prepare('SELECT `id` FROM `classes` WHERE `class_code`=?;');
          $stmt->bind_param('s', $code);
          $stmt->execute();
          $stmt->store_result ();
          $stmt->bind_result($class_id);
          $stmt->fetch();

          $stmt = $this->conn->prepare('SELECT `class_name` FROM `classes` WHERE `class_code`=?;');
          $stmt->bind_param('s', $code);
          $stmt->execute();
          $stmt->store_result ();
          $stmt->bind_result($class_name);
          $stmt->fetch();

          $stmt = $this->conn->prepare('SELECT `title`, `date_due`, `time_due` FROM `calendar_events` WHERE `class_id`=?;');
          $stmt->bind_param('s', $class_id);
          $stmt->execute();
          $result = $stmt->get_result();

          while ($data = $result->fetch_assoc()) {

              $data["class_code"] = $code;
              $data["class_name"] = $class_name;
              array_push($res, $data);

          }

        }

        return $res;

      } else {

        return -1;

      }

    }


}

?>
