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
  <script src="createClass.js"></script>
  <script src="../scripts/optimisations.js"></script>

  <title>Administrator Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img id="logo" src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/create-class">Create A Class</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/lecturer-register">Lecturer Registration</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/administrator-portal/delete-account">Delete An Account</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php

        if (include('../check-validity.php')) {

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/administrator-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/administrator/getClasses.php'; // Get Classes At Administrator's Uni
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
          /* Show Classes In Table Format */

          $string = '<a href="../logout.php" style="text-align: center;">Log Out</a>
          <h1 style="margin:0;"> Classes At My University </h1>
          <div class="input-container">
            <i class="fa fa-graduation-cap input_icon"></i>
            <input type="text" id="columnOne" onkeyup="searchByColumnOne()" placeholder="Search By Class Name..">
          </div>
          <div class="input-container">
            <i class="fa fa-user input_icon"></i>
            <input type="text" id="columnTwo" onkeyup="searchByColumnTwo()" placeholder="Search By Lecturer Name..">
          </div>
          <table id="dataTable">
            <tr>
              <td id="header-cell">Class Name</td>
              <td id="header-cell">Lecturer Name</td>
              <td id="header-cell">Class Code</td>
              <td id="header-cell">University</td>
              <td id="header-cell"></td>
            </tr>';

          foreach($result["message"] as $data) {
            $string .= '<tr><td id="data-cell">'
              .$data["class_name"].'</td>
              <td id="data-cell">'
              .$data["lecturer_forename"]
              .' '.$data["lecturer_surname"]
              .'</td>
              <td id="data-cell">'
              .$data["class_code"].'</td>
              <td id="data-cell">'
              .$data["university"].'</td>
              <td id="data-cell"><a href="./deleteClass.php?id='.$data["id"].'">Delete Class</a></td></tr>';
          }

          /* Add Form For Registering A New Class */

          $string .= '</table>
          <h1 style="margin:0;"> Create A New Class </h1>
          <ul style="text-align:center;padding:0;">
            <i> New Classes Will Be Automatically Assigned To Your Registered University </i>
          </ul>
          <form onSubmit="registerClass(event, '.$_SESSION[ 'account' ][ 'university_id' ].');">
            <fieldset>
              <legend>Class Registration</legend>
              Class Name:<br><br>
              <input type="text" id="name" value="">
              <br><br>
              Class Code:<br><br>
              <input type="text" id="code" value="">
              <br><br>
              Lecturer Email:<br><br>
              <input type="email" id="lecturer_email" value="">
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
