<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/login/dbOperation.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $db = new DbConnect ();
    $conn = $db->connect ();

    $op = new DbOperation ();

    $stmt = $conn->prepare('SELECT `code` FROM `account_recovery` WHERE `code` = ?;');
    $stmt->bind_param('s', $op->noHTML($_POST['id']));
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {

        if ($op->noHTML($_POST['password']) == $op->noHTML($_POST['confirm_password'])) {

            $options = [ 'cost' => 12 ];
            $password = password_hash($op->noHTML($_POST['password']), PASSWORD_BCRYPT, $options);

            $stmt = $conn->prepare ('UPDATE `users` SET `pass` = ? WHERE `email` = ?;');
            $stmt->bind_param ('ss', $password, $op->noHTML($_POST['email']));
            $stmt->execute ();

            $stmt = $conn->prepare ('DELETE FROM `account_recovery` WHERE `code` = ?;');
            $stmt->bind_param ('s', $op->noHTML($_POST['id']));
            $stmt->execute ();

            echo "Password Updated";

        } else {

            echo "Password Fields Must Match";

        }

    } else {

        echo "Session Expired";

    }

}

?>
