<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/higherFunctions/administrator/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id'])) {

        $db = new DbOperation();
        $res = $db->getClasses($db->noHTML($_POST['session_id']));

        if ($res === -1) {

          $response['error'] = true;
          $response['message'] = "Login Credentials Invalid - You Cannot Have More Than 1 Session Open At The Same Time";

        } else if ($res === -2) {

          $response['error'] = true;
          $response['message'] = 'User Is Not An Administrator';

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
