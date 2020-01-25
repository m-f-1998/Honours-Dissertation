<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');

  require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/userFunctions/dbOperation.php';

  $db = new DbConnect ();
  $conn = $db->connect ();

  $op = new DbOperation ();

  $stmt = $conn->query('DELETE FROM `verify_email` WHERE `time_stamp` < (UNIX_TIMESTAMP() - 6000);');
?>
