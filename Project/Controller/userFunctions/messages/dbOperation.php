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

        $stmt = $this->conn->prepare ('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param ('s', $sessionid);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function getThreads ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT
            `thread_id` AS `id`,
            `originating_user`,
            (SELECT `email` FROM `users` WHERE `id`=`originating_user`) AS `original_email`,
            (SELECT `forename` FROM `users` WHERE `id`=`originating_user`) AS `original_forename`,
            (SELECT `surname` FROM `users` WHERE `id`=`originating_user`) AS `original_surname`,
            (SELECT `profile_pic_link` FROM `users` WHERE `id`=`originating_user`) AS `original_profile_pic`,
            `recipient_user`,
            (SELECT `email` FROM `users` WHERE `id`=`recipient_user`) AS `recipient_email`,
            (SELECT `forename` FROM `users` WHERE `id`=`recipient_user`) AS `recipient_forename`,
            (SELECT `surname` FROM `users` WHERE `id`=`recipient_user`) AS `recipient_surname`,
            (SELECT `profile_pic_link` FROM `users` WHERE `id`=`recipient_user`) AS `recipient_profile_pic`,
            (SELECT `privacy` FROM `users` WHERE `id`=`recipient_user`) AS `privacy`,
            (SELECT `is_lecturer` FROM `users` WHERE `id`=`recipient_user`) AS `is_lecturer`
          FROM `message_threads` WHERE `originating_user`=?;');
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

    public function getID ($email) {

        $stmt = $this->conn->prepare ('SELECT `id` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function newMessageThread ($sessionid, $email) {

        $id = $this->getAccountID($sessionid);

        if ( $this->isUserExist( $email ) ) {

          $id_recip = $this->getID($email);

          if ( $id != NULL ) {

            $stmt = $this->conn->prepare('SELECT `thread_id` FROM `message_threads` WHERE `originating_user` = ? AND `recipient_user` = ?;');
            $stmt->bind_param('ss', $id, $id_recip);
            $stmt->execute();
            $stmt->store_result();

            if ( $stmt->num_rows == 0 ) {

              $stmt = $this->conn->prepare('SELECT `thread_id` FROM `message_threads` WHERE `originating_user` = ? AND `recipient_user` = ?;');
              $stmt->bind_param('ss', $id_recip, $id);
              $stmt->execute();
              $stmt->store_result();
              $stmt->bind_result ($thread_id);
              $stmt->fetch();

              if ( $stmt->num_rows == 0 ) {

                $stmt = $this->conn->prepare ( 'INSERT INTO `message_threads` ( `id`, `thread_id`, `originating_user`, `recipient_user` ) VALUES (UUID(), UUID(), ?, ?);' );
                $stmt->bind_param ('ss', $id, $id_recip);

                if ( $stmt->execute () ) {

                  return true;

                } else {

                  return -2;

                }

              } else {

                $stmt = $this->conn->prepare ( 'INSERT INTO `message_threads` ( `id`, `thread_id`, `originating_user`, `recipient_user` ) VALUES (UUID(), ?, ?, ?);' );
                $stmt->bind_param ('ss', $thread_id, $id, $id_recip);

                if ( $stmt->execute () ) {

                  return true;

                } else {

                  return -2;

                }

              }

            } else {

              return -4;

            }

          } else {

            return -1;

          }

        } else {

          return -3;

        }

    }

    public function sendMessage ($sessionid, $email, $threadid, $text) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $id_recip = $this->getID($email);

          $stmt = $this->conn->prepare ( 'INSERT INTO `messages` ( `id`, `message_thread`, `from_account`, `to_account`, `creation_date`, `creation_time` ) VALUES (UUID(), ?, ?, ?, CURDATE(), CURTIME());' );
          $stmt->bind_param ('sss', $threadid, $id, $id_recip);

          if ( $stmt->execute () ) {

            $stmt = $this->conn->prepare ('SELECT `id` FROM `messages` WHERE `creation_time`<=CURTIME() ORDER BY `creation_time` DESC LIMIT 1;');
            $stmt->execute ();
            $stmt->store_result();
            $stmt->bind_result ($messageid);
            $stmt->fetch();

            $stmt = $this->conn->prepare ( 'INSERT INTO `messages_text` ( `id`, `message` ) VALUES (?, ?) ON DUPLICATE KEY UPDATE `message`=?;' );
            $stmt->bind_param ('sss', $messageid, $text, $text);

            if ( $stmt->execute () ) {

              return true;

            } else {

              $stmt = $this->conn->prepare ('SELECT `push_allowed`, `push_token` FROM `users` WHERE `id`=?;');
              $stmt->bind_param ('s', $id_recip);
              $stmt->execute ();
              $stmt->store_result();
              $stmt->bind_result ($push_allowed, $push_token);
              $stmt->fetch();

              if ( $push_allowed ) {

                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $expo->subscribe('messages_server', $push_token);
                $notification = ['body' => 'Hello World!'];
                $expo->notify('messages_server', $notification);

              }

            }

          } else {

            return -2;

          }

        } else {

          return -1;

        }

    }

    public function getMessages ($sessionid, $threadid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id` AS `message_id`, `creation_date`, ( SELECT `users`.`email` FROM `users` WHERE `users`.`id` = `messages`.`from_account` ) AS `from_email`, `creation_time`, ( SELECT `message` FROM `messages_text` WHERE `id` = `message_id`) AS `message` FROM `messages` WHERE `message_thread`=?;');
          $stmt->bind_param ('s', $threadid);
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

    public function deleteMessage ($sessionid, $threadid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `id` FROM `messages` WHERE `message_thread`=?;');
          $stmt->bind_param ('s', $threadid);
          $stmt->execute ();
          $result = $stmt->get_result();
          $res = array();

          while ($data = $result->fetch_assoc()) {

              array_push($res, $data);

          }

          foreach ($res as $data) {

            $stmt = $this->conn->prepare ('DELETE FROM `messages_text` WHERE `id`=?;');
            $stmt->bind_param ('s', $data['id']);

            if ( ! $stmt->execute () ) {

              return -3;

            }

          }

          $stmt = $this->conn->prepare ('DELETE FROM `messages` WHERE `message_thread`=?;');
          $stmt->bind_param ('s', $threadid);

          if ( $stmt->execute () ) {

            $stmt = $this->conn->prepare ('DELETE FROM `message_threads` WHERE `thread_id`=?;');
            $stmt->bind_param ('s', $threadid);


            if ( $stmt->execute () ) {

              return true;

            } else {

              return -3;

            }

          } else {

            return -3;

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
