<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/higherFunctions/administrator/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && isset($_POST['classname']) && isset($_POST['classcode']) && isset($_POST['lectureremail']) && isset($_POST['uid'])) {

        $db = new DbOperation();
        $res = $db->classRegister($db->noHTML($_POST['session_id']), $db->noHTML($_POST['classname']), $db->noHTML($_POST['classcode']), $db->noHTML($_POST['lectureremail']), $db->noHTML($_POST['uid']));

        if ($res === -1) {

          $response['error'] = true;
          $response['message'] = "Login Credentials Invalid - You Cannot Have More Than 1 Session Open At The Same Time";

        } else if ($res === -2) {

          $response['error'] = true;
          $response['message'] = 'User Is Not An Administrator';

        } else if ($res === -3) {

          $response['error'] = true;
          $response['message'] = 'The Provided Lecturer Email Is Not Registered In The System';

        } else if ($res === -4) {

          $response['error'] = true;
          $response['message'] = 'Lecturer Cannot Teach More Than 4 Classes';

        } else if ($res === -5) {

          $response['error'] = true;
          $response['message'] = 'Class Titles Must be Unique For Each Calendar Year';

        } else {

          $response['error'] = false;
          $response['message'] = $res;

        }

    } else {

        $response['error'] = true;
        $response['message'] = "Request Invalid";

    }

} else {

    $response['error'] = true;
    $response['message'] = "Request Not Allowed";

}

echo json_encode($response);

?>
