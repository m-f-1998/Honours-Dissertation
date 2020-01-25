<?php

/**
* Structure Is Standard Open Source. Structure Sourced From And Changed/Added To: https://www.simplifiedios.net/ios-registration-form-example/
*
* User: Belal
* Date Accessed: 05/01/2019
*
*/

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/pedalPay/adminFunctions/dbAdminOperation.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/pedalPay/userFunctions/dbOperation.php';

$response = array ();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['email']) && isset($_POST['password'])) {

        $db = new DbOperation();
        $dbAdmin = new dbAdminOperation();

        if ($db->userLogin($db->noHTML($_POST['email']), $db->noHTML($_POST['password']))) {

            if ($db->isAdmin($db->noHTML($_POST['email']))) {

                $response['error'] = false;
                $response['message'] = $dbAdmin->userDetails();

            } else {

                $response['error'] = true;
                $response['message'] = "User Must Be Admin";

            }

        } else {

            $response['error'] = true;
            $response['message'] = "User Login Required";

        }

    } else {

        $response['error'] = true;
        $response['message'] = "All Fields Are Required To Access User Details";

    }

} else {

    $response['error'] = true;
    $response['message'] = "Request Not Allowed";

}

echo json_encode($response);

?>
