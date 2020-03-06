<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/higherFunctions/administrator/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && isset($_POST['userID'])) {

        $db = new DbOperation();
        $res = $db->deleteUser($db->noHTML($_POST['session_id']), $db->noHTML($_POST['userID']));

        if ($res === -1) {

          $response['error'] = true;
          $response['message'] = "Login Credentials Invalid - You Cannot Have More Than 1 Session Open At The Same Time";

        } else if ($res === -2) {

          $response['error'] = true;
          $response['message'] = 'User Is Not An Administrator';

        } else if ($res === -3) {

          $response['error'] = true;
          $response['message'] = 'This User Is Not Registered Is Not Registered In The System';

        } else if ($res === -4) {

          $response['error'] = true;
          $response['message'] = 'An Unkown Error Occured';

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
