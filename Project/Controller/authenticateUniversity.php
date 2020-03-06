<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';

function noHTML ($input, $encoding = 'UTF-8') {
    return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, $encoding);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['institute']) && isset($_POST['email']) && isset($_POST['password'])) {

        $db = new DbConnect ();
        $conn = $db->connect ();

        /* USES LOCAL APP PASSWORDS BUT THIS WOULD BE WHERE THE UNIVERSITY AUTHENTICATES THEIR OWN STUDENTS */
        $stmt = $conn->prepare('SELECT `pass` FROM `users` WHERE `email` = ?;');
        $stmt->bind_param('s', noHTML($_POST['email']));
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($password);
        $stmt->fetch();

        if ( password_verify(noHTML($_POST['password']), $password) ) {

          /* GENERATE CODE BASED ON EDUCATION INSTITUTE */
          $stmt = $conn->prepare('SELECT `id` FROM `university` WHERE `id`=?;');
          $stmt->bind_param('s', noHTML($_POST['institute']));
          $stmt->execute();
          $stmt->store_result();
          $stmt->bind_result($id);
          $stmt->fetch();

          $code = md5(uniqid(mt_rand()));
          $stmt = $conn->prepare('INSERT INTO `education_ids` (`code`, `uni_id`, `time_stamp`) VALUES (?, ?, UNIX_TIMESTAMP()) ON DUPLICATE KEY UPDATE code=?, time_stamp=UNIX_TIMESTAMP();');
          $stmt->bind_param('sss', $code, $id, $code);
          $stmt->execute();

          $response['error'] = false;
          $response['code'] = strval($code);
          $response['notice'] = "NOTICE: Multiple Universities Not Currently Supported In Simulation";

        } else {

          $response['error'] = true;
          $response['message'] = "Credentials Not Accepted";
          $response['notice'] = "";

        }

    } else {

        $response['error'] = true;
        $response['message'] = "All POST Parameters Are Required";
        $response['notice'] = "";

    }

} else {

    $response['error'] = true;
    $response['message'] = "Request Not Allowed";
    $response['notice'] = "";

}

echo json_encode($response);

?>
