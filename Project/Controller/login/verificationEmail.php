<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/login/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['email'])) {

        $db = new DbOperation();
        $result = $db->verificationEmail($db->noHTML($_POST['email']));

        if ($result == false) {

            $response['error'] = true;
            $response['message'] = "Invalid E-Mail";

        } else {

            $response['code'] = $result;
            $response['message'] = "Verification Email Sent";

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
