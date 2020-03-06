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

  <script src="lecturerRegister.js"></script>
  <script src="../scripts/optimisations.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

  <title>Administrator Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img id="logo" src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/lecturer-register">Lecturer Registration</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/create-class">Create A Class</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/delete-account">Delete An Account</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php

        if (isset($_POST[ 'code' ]) && isset($_POST[ 'account' ])) { // Save Session Variables After Login

          $_SESSION[ 'code' ] = $_POST[ 'code' ];
          $_SESSION[ 'account' ] = $_POST[ 'account' ];

        }

        if (include('../check-validity.php')) {

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/administrator-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/administrator/getLecturers.php'; // Get Lecturers At Administrators Uni
          $data = array('session_id' => $_SESSION[ 'code' ]);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
           )
         );
          $context  = stream_context_create($options);
          $result = json_decode(file_get_contents($url, false, $context), true);

          /* Construct HTML Based On Retrieved Data */

          $string = '<a href="../logout.php" style="text-align: center;">Log Out</a>
          <h1 style="margin:0;"> Register A New Lecturer </h1>
          <div class="input-container">
            <i class="fa fa-user input_icon"></i>
            <input type="text" id="columnOne" onkeyup="searchByColumnOne()" placeholder="Search By Name..">
          </div>
          <div class="input-container">
            <i class="fa fa-envelope input_icon"></i>
            <input type="text" id="columnTwo" onkeyup="searchByColumnTwo()" placeholder="Search By Email..">
          </div>
          <table id="dataTable">
            <tr>
              <td id="header-cell">Name</td>
              <td id="header-cell">Email</td>
              <td id="header-cell">University</td>
            </tr>';

          foreach($result["message"] as $data) {
            $string .= '<tr><td id="data-cell">'
              .$data["forename"]
              .' '.$data["surname"]
              .'</td><td id="data-cell">'
              .$data["email"].'</td><td id="data-cell">'
              .$data["university"].'</td></tr>';
          }

          $string .= '</table><ul style="text-align:center;padding:0;">
            <i> New Lecturer Accounts Will Be Automatically Assigned To Your Registered University </i>
          </ul>
          <form onSubmit="registerUser(event, '.$_SESSION[ 'account' ][ 'university_id' ].');">
            <fieldset>
              <legend>Registration</legend>
              Firstname:<br><br>
              <input type="text" id="forename" value="">
              <br><br>
              Surname:<br><br>
              <input type="text" id="surname" value="">
              <br><br>
              Email:<br><br>
              <input type="email" id="email" value="">
              <br><br>
              Password:<br><br>
              <input type="password" id="pass" value="">
              <br><br>
              Terms and Conditions Signed and Accepted:
              <input type="checkbox" id="terms">
              <br><br>
              <input type="submit" value="Submit">
            </fieldset>
          </form>';

          echo ($string);

        }
       ?>
    </div>
  </div>
</body>
</html>
