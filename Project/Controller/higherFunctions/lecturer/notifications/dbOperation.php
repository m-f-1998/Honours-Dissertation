<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

class dbOperation {

    private $conn;

    function __construct () {

        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';
        require_once __DIR__.'/../../../vendor/autoload.php';

        $db = new DbConnect();
        $this->conn = $db->connect();

    }

    public function noHTML ($input, $encoding = 'UTF-8') {
        return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, $encoding);
    }

  /**
   *
   * Push A Notification To A Given Email Address Or Class Group
   *
   */
    public function sendNotification ($sessionid, $data, $title, $body, $flag) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        $stmt = $this->conn->prepare ('SELECT `is_lecturer` FROM `users` WHERE `id`=?;');
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lecturer);
        $stmt->fetch();

        if ($lecturer == 1) {

          if (!$flag) {

            $stmt = $this->conn->prepare ('SELECT `push_allowed`, `push_token`, `id` FROM `users` WHERE `email`=?;');
            $stmt->bind_param('s', $data);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($push_allowed, $push_token, $id_recip);
            $stmt->fetch();

            if ($push_allowed == 1) {

              $notification = ['title' => $title, 'body' => $body];
              $channelName = 'custom_push';
              $expo = \ExponentPhpSDK\Expo::normalSetup();
              $expo->subscribe($channelName, $push_token);
              $expo->notify($channelName, $notification);
              $status = 'success';

            } else {

              return -2;

            }

          } else {

            $stmt = $this->conn->prepare ('SELECT `email` FROM `users` u, `student_classes` sc WHERE u.`id` = sc.`student_id` AND u.`university_id` != 1 AND sc.`class_id` = (SELECT `id` FROM `classes` WHERE `class_name` = ?)');
            $stmt->bind_param('s', $data);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($email = $result->fetch_assoc()) {

              $stmt = $this->conn->prepare ('SELECT `push_allowed`, `push_token`, `id` FROM `users` WHERE `email`=?;');
              $stmt->bind_param('s', $email["email"]);
              $stmt->execute();
              $stmt->store_result();
              $stmt->bind_result($push_allowed, $push_token, $id_recip);
              $stmt->fetch();

              if ($push_allowed) {

                $notification = ['title' => $data, 'body' => $body];
                $channelName = 'custom_push';
                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $expo->subscribe($channelName, $push_token);
                $expo->notify($channelName, $notification);
                $status = 'success';

              } else {

                return -2;

              }

            }

          }

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

        $stmt = $this->conn->prepare ('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param('s', $sessionid);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id);
        $stmt->fetch();
        return $id;

    }

}

?>
