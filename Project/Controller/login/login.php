<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/login/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['email']) && isset($_POST['password'])) {

        $db = new DbOperation();
        $result = $db->userLogin($db->noHTML($_POST['email']), $db->noHTML($_POST['password']));

        if ($result == false) {

            $response['error'] = true;
            $response['message'] = "Invalid E-Mail Or Password";

        } else {

            $response['code'] = $result;
            $response['error'] = false;
            $response['account'] = $db->getAccount($db->noHTML($_POST['email']));

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
