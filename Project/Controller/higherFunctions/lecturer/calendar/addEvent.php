<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/higherFunctions/lecturer/calendar/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && isset($_POST['title']) && isset($_POST['due']) && isset($_POST['class'])) {

        $db = new DbOperation();
        $res = $db->addEvent($db->noHTML($_POST['session_id']), $db->noHTML($_POST['title']), $db->noHTML($_POST['due']), $db->noHTML($_POST['class']));

        if ($res === -1) {

          $response['error'] = true;
          $response['message'] = "Login Credentials Invalid - You Cannot Have More Than 1 Session Open At The Same Time";

        } else if ($res === -2) {

          $response['error'] = true;
          $response['message'] = 'User Is Not A Lecturer';

        } else if ($res === -3) {

          $response['error'] = true;
          $response['message'] = 'Error Adding Event';

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
