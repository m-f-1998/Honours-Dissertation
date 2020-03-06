<?php
  session_start();
  unset($_SESSION['code']);
  unset($_SESSION['account']);
  session_destroy();
  header( "Location: /dissertation/lecturer-portal/" );
?>
