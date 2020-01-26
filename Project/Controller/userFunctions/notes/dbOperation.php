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

    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare ('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param ('s', $sessionid);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

}

?>
