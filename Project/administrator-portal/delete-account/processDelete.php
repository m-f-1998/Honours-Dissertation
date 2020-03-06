<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Administrator Portal - Study Planner">
  <meta name="author" content="Matthew Frankland">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"></head>

  <link rel="stylesheet" href="style.css">
  <link rel="shortcut icon" type="image/png" href="../favicon.png"/>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="deleteAccount.js"></script>
  <script src="../scripts/optimisations.js"></script>

  <title>Administrator Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img id="logo" src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/delete-account">Delete An Account</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/create-class">Create A Class</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/register">Lecturer Registration</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php

        if (include('../check-validity.php')) {

          echo ('<a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal" id="error">'.$result[ 'message' ].'</a>');

        } else {

          /* Construct HTML Based On Retrieved Data */

          $string = '<a href="../logout.php" style="text-align: center;">Log Out</a>
          <i>Are you sure you want to delete this user?<br />All data linked to this account will be deleted from the system</i>
          <a style="color:red;text-align:center;" href="#delete" onclick="deleteUser(event, `'.$_GET['id'].'`)">Continue</a>';

          echo ($string);

        }
       ?>
    </div>
  </div>
</body>
</html>
