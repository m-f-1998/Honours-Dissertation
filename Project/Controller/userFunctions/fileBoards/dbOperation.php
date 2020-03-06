<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

class dbOperation {

    private $conn;

    function __construct () {

        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';
        require_once __DIR__.'/../../vendor/autoload.php';

        $db = new DbConnect ();
        $this->conn = $db->connect ();

    }

    public function noHTML ($input, $encoding = 'UTF-8') {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, $encoding);
    }

    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param('s', $sessionid);
        $stmt->execute();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    /**
     *
     * Get All Boards Associated With Classes Students Are Registered To
     *
     */
    public function getBoards ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT `class_id` FROM `student_classes` WHERE `student_id`=?;');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $classids = $stmt->get_result();
          $res = array();

          while ($data = $classids->fetch_assoc()) {

            $stmt = $this->conn->prepare('SELECT `title`, `link` FROM `board` WHERE `class_id`=?;');
            $stmt->bind_param('i', $data["class_id"]);
            $stmt->execute();
            $class_details = $stmt->get_result();

            $stmt = $this->conn->prepare('SELECT `class_name` FROM `classes` WHERE `id`=?;');
            $stmt->bind_param('s', $data["class_id"]);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($class_name);
            $stmt->fetch();

            while ($return = $class_details->fetch_assoc()) {

                $return["class_name"] = $class_name;
                array_push($res, $return);

            }

          }

          return $res;

        } else {

          return -1;

        }

    }

}

?>
