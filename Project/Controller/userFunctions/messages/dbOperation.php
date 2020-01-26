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

    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare ('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param ('s', $sessionid);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function getMessages ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT
            `id`,
            `from_account`,
            (SELECT `email` FROM `users` WHERE `id`=`from_account`) AS `from_email`,
            (SELECT `forename` FROM `users` WHERE `id`=`from_account`) AS `from_forename`,
            (SELECT `surname` FROM `users` WHERE `id`=`from_account`) AS `from_surname`,
            (SELECT `profile_pic_link` FROM `users` WHERE `id`=`from_account`) AS `from_profile_pic`,
            (SELECT `privacy` FROM `users` WHERE `id`=`from_account`) AS `from_privacy`,
            `to_account`,
            (SELECT `email` FROM `users` WHERE `id`=`to_account`) AS `to_email`,
            (SELECT `forename` FROM `users` WHERE `id`=`to_account`) AS `to_forename`,
            (SELECT `surname` FROM `users` WHERE `id`=`to_account`) AS `to_surname`,
            (SELECT `profile_pic_link` FROM `users` WHERE `id`=`to_account`) AS `to_profile_pic`,
            (SELECT `privacy` FROM `users` WHERE `id`=`to_account`) AS `to_privacy`,
            `creation_date`
          FROM `messages` WHERE `from_account`=?;');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          $stmt = $this->conn->prepare ('SELECT `id`, `from_account`, (SELECT `email` FROM `users` WHERE `id`=`from_account`) AS `from_email`, `to_account`, (SELECT `email` FROM `users` WHERE `id`=`to_account`) AS `to_email`, `creation_date` FROM `messages` WHERE `to_account`=?');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
          $result = $stmt->get_result();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          return $res;

        } else {

          return -1;

        }

    }

    public function getID ($email) {

        $stmt = $this->conn->prepare ('SELECT `id` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function newMessage ($sessionid, $email) {

        $id = $this->getAccountID($sessionid);

        if ( $this->isUserExist( $email ) ) {

          $id_recip = $this->getID($email);

          if ( $id != NULL ) {

            $stmt = $this->conn->prepare ( 'INSERT INTO `messages` ( `id`, `from_account`, `to_account`, `creation_date` ) VALUES (UUID(), ?, ?, CURDATE());' );
            $stmt->bind_param ('ss', $id, $id_recip);

            if ( $stmt->execute () ) {

              return true;

            } else {

              return -2;

            }

          } else {

            return -1;

          }

        } else {

          return -3;

        }

    }

    public function sendMessage ($sessionid, $messageid, $messagetext) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ( 'INSERT INTO `messages_text` ( `id`, `message` ) VALUES (?, ?) ON DUPLICATE KEY UPDATE `message`=?;' );
          $stmt->bind_param ('sss', $messageid, $messagetext, $messagetext);

          if ( $stmt->execute () ) {

            return true;

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function getMessage ($sessionid, $messageid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id` FROM `messages` WHERE `from_account`=? AND `id`=?;');
          $stmt->bind_param ('ss', $id, $messageid);
          $stmt->execute ();
          $stmt->store_result();
          $stmt->bind_result ($message);
          $stmt->fetch();

          if ($message === $messageid) {

            $stmt = $this->conn->prepare ('SELECT `message` FROM `messages_text` WHERE `id`=?;');
            $stmt->bind_param ('s', $messageid);
            $stmt->execute ();
            $stmt->store_result();
            $stmt->bind_result ($messagetext);
            $stmt->fetch();

            if ($messagetext == null) {

              return '';

            } else {

              return $messagetext;

            }

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function deleteMessage ($sessionid, $messageid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id` FROM `messages` WHERE `from_account`=? AND `id`=?;');
          $stmt->bind_param ('ss', $id, $messageid);
          $stmt->execute ();
          $stmt->store_result();
          $stmt->bind_result ($message);
          $stmt->fetch();

          if ($message === $messageid) {

            $stmt = $this->conn->prepare ('DELETE FROM `messages_text` WHERE `id`=?;');
            $stmt->bind_param ('s', $messageid);

            if ( $stmt->execute () ) {

              $stmt = $this->conn->prepare ('DELETE FROM `messages` WHERE `id`=?;');
              $stmt->bind_param ('s', $messageid);

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

    private function isUserExist ($email) {

        $stmt = $this->conn->prepare('SELECT `id` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        return $stmt->num_rows > 0;

    }

}

?>
