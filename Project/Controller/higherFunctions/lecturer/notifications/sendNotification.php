<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/higherFunctions/lecturer/notifications/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && (isset($_POST['email']) || isset($_POST['class']))  && isset($_POST['body']) && isset($_POST['title'])) {

        $data = "";
        $flag = false;

        if (isset($_POST['email'])) {

          $data = $_POST['email'];

        } else {

          $data = $_POST['class'];
          $flag = true;

        }

        $db = new DbOperation();
        $res = $db->sendNotification($db->noHTML($_POST['session_id']), $data, $db->noHTML($_POST['title']), $db->noHTML($_POST['body']), $flag);

        if ($res === -1) {

          $response['error'] = true;
          $response['message'] = "Login Credentials Invalid - You Cannot Have More Than 1 Session Open At The Same Time";

        } else if ($res === -2) {

          $response['error'] = true;
          $response['message'] = 'User Is Not A Lecturer';

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

$response['test'] = "Request Invalid";

echo json_encode($response);

?>
