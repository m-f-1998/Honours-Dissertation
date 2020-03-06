<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/login/dbOperation.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['email']) && isset($_POST['pass']) && isset($_POST['forename']) && isset($_POST['surname']) && isset($_POST['uid'])) {

        $db = new DbOperation();
        $result = $db->createAdminUser($db->noHTML($_POST['email']), $db->noHTML($_POST['pass']), $db->noHTML($_POST['forename']), $db->noHTML($_POST['surname']), $db->noHTML($_POST['uid']));

        if ($result === -1) {

            $response['error'] = true;
            $response['message'] = "Email Already Exists. Please Log In";

        } elseif ($result === -2) {

            $response['error'] = true;
            $response['message'] = "Some Error Occurred";

        } else {

            $response['error'] = false;
            $response['code'] = $result;
            $response['message'] = "Account Created Successfully";

        }

    } else {

        $response['error'] = true;
        $response['message'] = "All POST Parameters Are Required";

    }

} else {

    $response['error'] = true;
    $response['message'] = "Invalid Request";

}

echo json_encode($response);

?>
