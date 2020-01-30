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

    public function getEmailValid ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `email_verified` FROM `users` WHERE `id`=?;');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
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

    public function getEducationValid ($sessionid) {

        $id = $this->getAccountID($sessionid);

        if ( $id != NULL ) {

          $stmt = $this->conn->prepare ('SELECT `university_id` FROM `users` WHERE `id`=?;');
          $stmt->bind_param ('s', $id);
          $stmt->execute ();
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

    public function getAccountID ($sessionid) {

        $stmt = $this->conn->prepare ('SELECT `account_id` FROM `session_ids` WHERE `code`=?;');
        $stmt->bind_param ('s', $sessionid);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function updatePush ($sessionid, $token, $allowed) {
      $id = $this->getAccountID($sessionid);

      $stmt = $this->conn->prepare ( 'UPDATE `users` SET `push_token` = ?, `push_allowed` = ? WHERE `id`=?;' );
      $stmt->bind_param ( 'sss', $token, $allowed, $id );

      if ( $stmt->execute () ) {

        return true;

      } else {

        return -2;

      }
    }

    public function updateProfile ($sessionid, $forename, $surname, $email, $profilePicLink) {

      $id = $this->getAccountID($sessionid);

      if ( $profilePicLink == '' ) {

        $profilePicLink = NULL;

      }

      if ( $id != NULL ) {

        if ( $email === '' ) {

          if ( $forename === '' ) {

            if ( $surname !== '' ) {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `surname` = ?, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('sss', $surname, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -2;

              }

            }

          } else {

            if ( $surname === '' ) {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `forename` = ?, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('sss', $forename, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -2;

              }

            } else {

              $stmt = $this->conn->prepare ('UPDATE `users` SET `surname` = ?, `forename`=?, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('ssss', $surname, $forename, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                return true;

              } else {

                return -2;

              }

            }

          }

        } else {

          if ( $forename === '' ) {

            if ( $surname === '' ) {

              if ( $this->isUserExist( $email ) ) {

                return -3;

              }

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('sss', $email, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            } else {

              if ( $this->isUserExist( $email ) ) {

                return -3;

              }

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('ssss', $email, $surname, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            }

          } else {

            if ( $surname === '' ) {

              if ( $this->isUserExist( $email ) ) {

                return -3;

              }

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `forename` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('ssss', $email, $forename, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
                return true;

              } else {

                return -2;

              }

            } else {

              if ( $this->isUserExist( $email ) ) {

                return -3;

              }

              $stmt = $this->conn->prepare ('UPDATE `users` SET `email` = ?, `forename`=?, `surname` = ?, `email_verified` = 0, `profile_pic_link` = ? WHERE `id`=?;');
              $stmt->bind_param ('sssss', $email, $forename, $surname, $profilePicLink, $id);

              if ( $stmt->execute () ) {

                $this->verificationEmail( $email );
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

        if ( $id != NULL ) {

          if ( $value == 'true' ) {

            $stmt = $this->conn->prepare ( 'UPDATE `users` SET `privacy` = 1 WHERE `id` = ?;' );
            $stmt->bind_param ('s', $id);

            if ( $stmt->execute () ) {

              return true;

            } else {

              return -2;

            }

          } else {

            $stmt = $this->conn->prepare ( 'UPDATE `users` SET `privacy` = 0 WHERE `id` = ?;' );
            $stmt->bind_param ('s', $id);

            if ( $stmt->execute () ) {

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
