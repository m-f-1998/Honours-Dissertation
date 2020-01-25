<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/userFunctions/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id'])) {

        $db = new DbOperation();
        $res = $db->updateProfile($db->noHTML($_POST['session_id']), $db->noHTML($_POST['forename']), $db->noHTML($_POST['surname']), $db->noHTML($_POST['email']), $db->noHTML($_POST['profile_pic_link']));

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
