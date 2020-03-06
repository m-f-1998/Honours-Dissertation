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
   * Check The Email Associated With A Session Is Valid
   *
   */
    public function getEmailValid ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT `email_verified` FROM `users` WHERE `id`=?;');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $stmt->bind_result ($emailVerified);
          $stmt->fetch();

          if ($emailVerified == 0) {

            return false;

          }

          return true;

        } else {

          return -1;

        }

    }

    /**
     *
     * Check The Education Institute Associated With A Session Is Valid
     *
     */
      public function getEducationValid ($sessionid) {

          $id = $this->getAccountID($sessionid);

          if ($id != NULL) {

            $stmt = $this->conn->prepare('SELECT `university_id` FROM `users` WHERE `id`=?;');
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $stmt->bind_result ($educationVerified);
            $stmt->fetch();

            if ($educationVerified == 1) {

              return false;

            }

            return true;

          } else {

            return -1;

          }

      }

  /**
   *
   * Get The University Data Which The Current Sessions's Account Is Registered To
   *
   */
    public function getUniData ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT `university_name`, `server_address` FROM `university` WHERE `id`=(SELECT `university_id` FROM `users` WHERE `id`=?)');
          $stmt->bind_param('s', $id);
          $stmt->execute();
          $stmt->bind_result ($uniName, $serverAddress);
          $stmt->fetch();

          return [$uniName, $serverAddress];

        } else {

          return -1;

        }

    }

  /**
   *
   * Authenticate That A Passed Education Verification Code Is Valid
   *
   */
    public function authenticateEducation ($sessionid, $code) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          $stmt = $this->conn->prepare('SELECT `code` FROM `education_ids` WHERE `code` = ?;');
          $stmt->bind_param('s', $code);
          $stmt->execute();
          $stmt->store_result();

          if ($stmt->num_rows > 0) {

            $stmt = $this->conn->prepare('SELECT `uni_id` FROM `education_ids` WHERE `code` = ?;');
            $stmt->bind_param('s', $code);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result ($uni_id);
            $stmt->fetch();

            $stmt = $this->conn->prepare('DELETE FROM `education_ids` WHERE `code`=?;');
            $stmt->bind_param('s', $code);

            if ($stmt->execute()) {

              $stmt = $this->conn->prepare('UPDATE `users` SET `university_id` = ? WHERE `id`=?;');
              $stmt->bind_param('is', $uni_id, $id);

              if ($stmt->execute()) {

                return $uni_id;

              } else {

                return -2;

              }

            } else {

              return -2;

            }

          }

          return -1;

        }

    }

  /**
   *
   * Get The Account ID Associated With A Session
   *
   */
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
   * Update An Accounts Push Notification Token And Flag For If Notifications Are Allowed
   *
   */
    public function updatePush ($sessionid, $token, $allowed) {

      $id = $this->getAccountID($sessionid);

      $stmt = $this->conn->prepare('UPDATE `users` SET `push_token` = ?, `push_allowed` = ? WHERE `id`=?;');
      $stmt->bind_param('sss', $token, $allowed, $id);

      if ($stmt->execute()) {

        return true;

      } else {

        return -2;

      }

    }

  /**
   *
   * Update A Profile With New Information Dependant On What Has Been Provided
   *
   */
    public function updateProfile ($sessionid, $forename, $surname, $email, $profilePicLink) {

      $id = $this->getAccountID($sessionid);

      if ($id != NULL) {

        if ($email === '') {

          if ($forename === '') {

            if ($surname !== '') {

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `surname` = ?, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('ss', $surname, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `surname` = ?, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('sss', $surname, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                return true;

              } else {

                return -2;

              }

            }

          } else {

            if ($surname === '') {

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `forename` = ?, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('ss', $forename, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `forename` = ?, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('sss', $forename, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                return true;

              } else {

                return -2;

              }

            } else {

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `surname` = ?, `forename`=?, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('sss', $surname, $forename, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `surname` = ?, `forename`=?, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('ssss', $surname, $forename, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                return true;

              } else {

                return -2;

              }

            }

          }

        } else {

          if ($forename === '') {

            if ($surname === '') {

              if ($this->isUserExist($email)) {

                return -3;

              }

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `email_verified` = 0, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('ss', $email, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('sss', $email, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                $this->verificationEmail($email);
                return true;

              } else {

                return -2;

              }

            } else {

              if ($this->isUserExist($email)) {

                return -3;

              }

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('sss', $email, $surname, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('ssss', $email, $surname, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                $this->verificationEmail($email);
                return true;

              } else {

                return -2;

              }

            }

          } else {

            if ($surname === '') {

              if ($this->isUserExist($email)) {

                return -3;

              }

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `forename` = ?, `email_verified` = 0, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('sss', $email, $forename, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `forename` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('ssss', $email, $forename, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                $this->verificationEmail($email);
                return true;

              } else {

                return -2;

              }

            } else {

              if ($this->isUserExist($email)) {

                return -3;

              }

              if ($profilePicLink == '' || $profilePicLink == 'null') {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `forename`=?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = NULL WHERE `id`=?;');
                $stmt->bind_param('ssss', $email, $forename, $surname, $id);

              } else {

                $stmt = $this->conn->prepare('UPDATE `users` SET `email` = ?, `forename`=?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
                $stmt->bind_param('sssss', $email, $forename, $surname, $profilePicLink, $id);

              }

              if ($stmt->execute()) {

                $this->verificationEmail($email);
                return true;

              } else {

                return -2;

              }

            }

          }

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

    public function updatePrivacy ($sessionid, $value) {

        $id = $this->getAccountID($sessionid);

        if ($id != NULL) {

          if ($value == 'true') {

            $stmt = $this->conn->prepare('UPDATE `users` SET `privacy` = 1 WHERE `id` = ?;');
            $stmt->bind_param('s', $id);

            if ($stmt->execute()) {

              return true;

            } else {

              return -2;

            }

          } else {

            $stmt = $this->conn->prepare('UPDATE `users` SET `privacy` = 0 WHERE `id` = ?;');
            $stmt->bind_param('s', $id);

            if ($stmt->execute()) {

              return true;

            } else {

              return -2;

            }

          }

        } else {

          return -1;

        }

    }

}

?>
