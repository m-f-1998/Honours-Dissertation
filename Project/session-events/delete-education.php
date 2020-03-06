<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET');

  require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/constants.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/dissertation/dbConnection/dbConnect.php';

  $db = new DbConnect ();
  $conn = $db->connect ();

  $stmt = $conn->query('DELETE FROM `education_ids` WHERE `time_stamp` < (UNIX_TIMESTAMP() - 3600);');
?>
