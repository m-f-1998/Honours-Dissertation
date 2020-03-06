<?php

    /**
     *
     * [emailConfirm Run Check On Email Verification Code]
     *
     */

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET');

    require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/userFunctions/dbOperation.php';

    $db = new DbConnect ();
    $conn = $db->connect ();

    $op = new DbOperation ();

    $stmt = $conn->prepare('SELECT `code` FROM `verify_email` WHERE `code` = ?;');
    $stmt->bind_param('s', $op->noHTML($_REQUEST['code']));
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {

      $stmt = $conn->prepare('UPDATE `users` SET `email_verified` = 1 WHERE `email` = ?;');
      $stmt->bind_param('s', $op->noHTML($_REQUEST['email']));
      $stmt->execute();

      $stmt = $conn->prepare('DELETE FROM `verify_email` WHERE `code` = ?;');
      $stmt->bind_param('s', $op->noHTML($_REQUEST['code']));
      $stmt->execute();

      echo "<script>alert('Thank You! Your Email Has Been Verified'); window.close(); </script>";

    } else {

      echo "<script>alert('Session Expired - Please Request Another Confirmation Email In The Application'); window.close();</script>";

    }

?>
