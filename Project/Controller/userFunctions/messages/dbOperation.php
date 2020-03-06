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
   * Get An Account ID Associated With A Session
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
   * Get All Possible Threads Of Messages Associated With A Given Session
   *
   */
    public function getThreads ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT
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
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $result = $stmt->get_result();
          $originating_array = array();

          while ($data = $result->fetch_assoc()) {

              array_push($originating_array, $data);

          }

          $stmt = $this->conn->prepare('SELECT
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
            (SELECT `privacy` FROM `users` WHERE `id`=`originating_user`) AS `privacy`,
            (SELECT `is_lecturer` FROM `users` WHERE `id`=`originating_user`) AS `is_lecturer`
          FROM `message_threads` WHERE `recipient_user`=?;');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $result = $stmt->get_result();
          $recipient_array = array();

          while ($data = $result->fetch_assoc()) {

              array_push($recipient_array, $data);

          }

          $res = ['originating' => $originating_array, 'recipient' => $recipient_array];

          return $res;

        } else {

          return -1;

        }

    }

  /**
   *
   * Get An ID Of A User Based On Their Email
   *
   */
    public function getID ($email) {

        $stmt = $this->conn->prepare('SELECT `id` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->bind_result($id);
        $stmt->fetch();
        return $id;

    }

  /**
   *
   * Create A New Message Thread Using Recipient Email
   *
   */
    public function newMessageThread ($sessionid, $email) {

        $id = $this->getAccountID($sessionid);

        if ($this->isUserExist($email)) {

          $id_recip = $this->getID($email);

          if ($id != NULL) {

            $stmt = $this->conn->prepare('SELECT `thread_id` FROM `message_threads` WHERE `originating_user` = ? AND `recipient_user` = ?;');
            $stmt->bind_param('ss', $id, $id_recip);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows == 0) {

              $stmt = $this->conn->prepare('SELECT `thread_id` FROM `message_threads` WHERE `originating_user` = ? AND `recipient_user` = ?;');
              $stmt->bind_param('ss', $id_recip, $id);
              $stmt->execute();
              $stmt->store_result();
              $stmt->bind_result($thread_id);
              $stmt->fetch();

              if ($stmt->num_rows == 0) {

                $stmt = $this->conn->prepare('INSERT INTO `message_threads` (`id`, `thread_id`, `originating_user`, `recipient_user`) VALUES (UUID(), UUID(), ?, ?);');
                $stmt->bind_param('ss', $id, $id_recip);

                if ($stmt->execute()) {

                  return true;

                } else {

                  return -2;

                }

              } else {

                $stmt = $this->conn->prepare('INSERT INTO `message_threads` (`id`, `thread_id`, `originating_user`, `recipient_user`) VALUES (UUID(), ?, ?, ?);');
                $stmt->bind_param('sss', $thread_id, $id, $id_recip);

                if ($stmt->execute()) {

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

  /**
   *
   * Send A Message On A Given Thread To Given Email
   *
   */
    public function sendMessage ($sessionid, $email, $threadid, $text) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $id_recip = $this->getID($email);

          $stmt = $this->conn->prepare('INSERT INTO `messages` (`id`, `message_thread`, `from_account`, `to_account`, `creation_date`, `creation_time`) VALUES (UUID(), ?, ?, ?, CURDATE(), CURTIME());');
          $stmt->bind_param('sss', $threadid, $id, $id_recip);

          if ($stmt->execute()) {

            $stmt = $this->conn->prepare('SELECT `id` FROM `messages` WHERE `creation_time`<=CURTIME() ORDER BY `creation_time` DESC LIMIT 1;');
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($messageid);
            $stmt->fetch();

            $stmt = $this->conn->prepare('INSERT INTO `messages_text` (`id`, `message`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `message`=?;');
            $stmt->bind_param('sss', $messageid, $text, $text);

            if ($stmt->execute()) {

              $stmt = $this->conn->prepare('SELECT `push_allowed`, `push_token`, `email` FROM `users` WHERE `id`=?;');
              $stmt->bind_param('s', $id_recip);
              $stmt->execute();
              $stmt->store_result();
              $stmt->bind_result($push_allowed, $push_token, $user);
              $stmt->fetch();

              if ($push_allowed == 1) {

                $notification = ['title' => 'Higher Education Study Planner', 'body' => 'New Message From ' . $user];
                try {

                  $expo = \ExponentPhpSDK\Expo::normalSetup();
                  $expo->notify(strval($id_recip),$notification);//$userId from database
                  $status = 'success';

                } catch(Exception $e){

                  $expo->subscribe($push_token, $push_token); //$userId from database
                  $expo->notify(strval($id_recip),$notification);
                  $status = 'new subscribtion';

                }

              }

              return true;

            } else {

              return -2;

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
   * Get All Messages For A Given Thread
   *
   */
    public function getMessages ($sessionid, $threadid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT `id` AS `message_id`, `creation_date`, (SELECT `users`.`email` FROM `users` WHERE `users`.`id` = `messages`.`to_account`) AS `to_email`, `creation_time`, (SELECT `message` FROM `messages_text` WHERE `id` = `message_id`) AS `message` FROM `messages` WHERE `message_thread`=? ORDER BY `creation_date` ASC, `creation_time` ASC;');
          $stmt->bind_param('s', $threadid);
          $stmt->execute();
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

  /**
   *
   * Delete Passed Message Thread And All Messages Associated With It
   *
   */
    public function deleteMessage ($sessionid, $threadid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

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
