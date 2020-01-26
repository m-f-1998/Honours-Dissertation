<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/userFunctions/notes/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['session_id']) && isset($_POST['note_id'])) {

        $db = new DbOperation();
        $res = $db->getNote($db->noHTML($_POST['session_id']), $db->noHTML($_POST['note_id']));

        if ( $res === -1 ) {

          $response['error'] = true;
          $response['message'] = 'Session ID Invalid';

        } else if ( $res === -2 ) {

          $response['error'] = true;
          $response['message'] = 'Note Does Not Belong To This Account';

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
