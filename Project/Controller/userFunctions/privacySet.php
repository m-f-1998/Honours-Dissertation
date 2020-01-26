<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/userFunctions/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && isset($_POST['value'])) {

        $db = new DbOperation();
        $res = $db->updatePrivacy($db->noHTML($_POST['session_id']), $db->noHTML($_POST['value']));

        if ( $res === -1 ) {

          $response['error'] = true;
          $response['message'] = 'Session ID Invalid';

        } else if ( $res === -2 ) {

          $response['error'] = true;
          $response['message'] = 'Privacy Settings Could Not Be Updated';

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
