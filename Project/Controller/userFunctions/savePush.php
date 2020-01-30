<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/userFunctions/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && isset($_POST['token']) && isset($_POST['allowed'])) {

        $db = new DbOperation();
        $res = $db->updatePush($db->noHTML($_POST['session_id']), $db->noHTML($_POST['token']), $db->noHTML($_POST['allowed']));

        if ( $res === -1 ) {

          $response['error'] = true;
          $response['message'] = 'Session ID Invalid';

        } else if ( $res === -2 ) {

          $response['error'] = true;
          $response['message'] = 'Profile Could Not Be Updated';

        } else {

          $response['error'] = false;
          $response['message'] = $res;

        }

    } else {

        $response['error'] = true;
        $response['message'] = "All POST Parameters Are Required";

    }

} else {

    $response['error'] = true;
    $response['message'] = "Request Not Allowed";

}

echo json_encode($response);

?>
