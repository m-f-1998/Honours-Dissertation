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

    public function userLogin ($email, $pass) {

        $stmt = $this->conn->prepare ('SELECT `pass` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->store_result();
        $stmt->bind_result ($password);
        $stmt->fetch();

        if ( password_verify($pass, $password) ) {
          $code = md5(uniqid(mt_rand()));
          $id = $this->getID($email);
          $stmt = $this->conn->prepare('INSERT INTO `session_ids` (`code`, `account_id`, `time_stamp`) VALUES (?, ?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
          $stmt->bind_param('sss', $code, $id, $code);
          $stmt->execute();
          return $code;
        }

        return false;

    }

    public function getID ($email) {

        $stmt = $this->conn->prepare ('SELECT `id` FROM `users` WHERE `email`=?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->bind_result ($id);
        $stmt->fetch();
        return $id;

    }

    public function getAccount ($email) {
        $stmt = $this->conn->prepare ('SELECT `surname`, `forename`, `profile_pic_link`, `email`, `university_id`, `is_admin`, `email_verified` FROM `users` WHERE `email`=?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $result = $stmt->get_result();
        $res = array();

        while ($data = $result->fetch_assoc()) {

            array_push($res, $data);

        }

        return $res;
    }

    public function isAdmin ($email) {

        $stmt = $this->conn->prepare ('SELECT `is_admin` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param ('s', $email);
        $stmt->execute ();
        $stmt->store_result();
        $stmt->bind_result ($admin);
        $stmt->fetch();
        return $admin;

    }

    public function resetPass ($email) {

        if ($this->isUserExist ($email)) {

            $code = md5(uniqid(mt_rand()));
            $uniqueLink = 'https://www.matthewfrankland.co.uk/dissertation/resetPass/passwordRecovery.php?code='.$code.'&email='.$email;

            $subject = 'Password Update Request => Higher Education Study Planner';
            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type:text/html;charset=UTF-8' . "\r\n";
            $headers .= 'From: StudyPlanner<noreply@studyplanner.com>' . "\r\n";
            $mailContent = 'Recently a request was submitted to reset a password for your account. If this was a mistake or you did not request this email, please destroy this email without any further action.<br/>To reset your password, visit the following link: <a href="'.$uniqueLink.'">'.$uniqueLink.'</a><br/><br/>Regards,<br/>HE Study Planner Team';

            $stmt = $this->conn->prepare('INSERT INTO `account_recovery` (`code`, `time_stamp`) VALUES (?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
            $stmt->bind_param('ss', $code, $code);
            $stmt->execute();

            mail($email,$subject,$mailContent,$headers);

            return true;

        } else {

            return false;

        }

    }

    public function createUser ($email, $pass) {

        if (!$this->isUserExist ($email)) {

            $options = ['cost' => 12,];
            $password = password_hash($pass, PASSWORD_BCRYPT, $options);
            $stmt = $this->conn->prepare ('INSERT INTO `users` (`id`, `surname`, `forename`, `profile_pic_link`, `email`, `pass`, `university_id`, `is_admin`, `email_verified`) VALUES (UUID(), NULL, NULL, NULL, ?, ?, 1, false, false);');
            $stmt->bind_param ('ss', $email, $password);

            if ($stmt->execute ()) {

                if ($this->verificationEmail($email)) {

                  $code = md5(uniqid(mt_rand()));

                  $id = $this->getID($email);
                  $stmt = $this->conn->prepare('INSERT INTO `session_ids` (`code`, `account_id`, `time_stamp`) VALUES (?, ?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
                  $stmt->bind_param('sss', $code, $id, $code);
                  $stmt->execute();

                  return $code;

                }

            } else {

                return -2;

            }

        } else {

            return -1;

        }

    }

    public function verificationEmail ($email) {

      $code = md5(uniqid(mt_rand()));
      $uniqueLink = 'https://www.matthewfrankland.co.uk/dissertation/confirmEmail/emailConfirm.php?code='.$code.'&email='.$email;

      $subject = 'Email Confirmation => Higher Education Study Planner';
      $headers = 'MIME-Version: 1.0' . "\r\n";
      $headers .= 'Content-type:text/html;charset=UTF-8' . "\r\n";
      $headers .= 'From: StudyPlanner<noreply@studyplanner.com>' . "\r\n";
      $mailContent = 'Thank you for creating an account with the Higher Education Study Planner App. If this was a mistake or you did not request this email, please destroy this email without any further action.<br/>To verify your email, visit the following link: <a href="'.$uniqueLink.'">'.$uniqueLink.'</a><br/><br/>Regards,<br/>HE Study Planner Team';

      $stmt = $this->conn->prepare('INSERT INTO `verify_email` VALUES (?, UNIX_TIMESTAMP());');
      $stmt->bind_param('s', $code);
      $stmt->execute();
      mail($email,$subject,$mailContent,$headers);

      return true;

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
