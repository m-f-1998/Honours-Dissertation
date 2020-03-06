<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Lecturer Portal - Study Planner">
  <meta name="author" content="Matthew Frankland">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <link rel="stylesheet" href="style.css">
  <link rel="shortcut icon" type="image/png" href="../favicon.png"/>
  <script src="./search.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <title>Lecturer Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img id="logo" src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details">Details</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/files">Files</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/messenger">Messenger</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/calendar">Calendar</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications">Notifications</a>
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

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/getStudents.php'; // Get Students Of Logged In Lecturer
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

          $string = '
          <a href="../logout.php" style="text-align: center;">Log Out</a>
          <h1 style="margin:0;"> Students Details </h1>
          <ul style="text-align:center;padding:0;">
            <i> Students Who Are In Multiple Classes Will Appear Multiple Times </i><br /><br />
            <i> If Students Have Not Allowed Their Name To Be Shared The Data Has Been Hidden </i><br /><br />
            <i> Students Must Verify Their Email And Education Institute Before They Appear Below </i>
          </ul>
          <div class="input-container">
            <i class="fa fa-user input_icon"></i>
            <input type="text" id="searchBarName" onkeyup="searchByName()" placeholder="Search By Name..">
          </div>
          <div class="input-container">
            <i class="fa fa-envelope input_icon"></i>
            <input type="text" id="searchBarEmail" onkeyup="searchByEmail()" placeholder="Search By Email..">
          </div>
          <table id="dataTable">
            <tr>
              <td id="header-cell">Name</td>
              <td id="header-cell">Email</td>
              <td id="header-cell">University</td>
              <td id="header-cell">Class</td>
              <td id="header-cell">Send A Notification</td>
            </tr>';

          foreach($result["message"] as $data) {
            if ($data["privacy"] == 1) {
              $string .= '<tr><td id="data-cell">'
                .$data["forename"]
                .' '.$data["surname"]
                .'</td><td id="data-cell">'
                .$data["email"].'</td><td id="data-cell">'
                .$data["university"].'</td><td id="data-cell">'
                .$data["class"].'</td></td>
                <td id="data-cell"><a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications?email='
                .$data["email"].'">Click Here</a></td></tr>';
            } else {
              $string .= '<tr>
                <td id="data-cell"></td>
                <td id="data-cell">'.$data["email"].'</td>
                <td id="data-cell">'.$data["university"].'</td>
                <td id="data-cell">'.$data["class"].'</td>
                <td id="data-cell">
                  <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications?email='.$data["email"].'">Click Here</a>
                </td>
              </tr>';
            }
          }
          $string .= '</table>';

          echo ($string);

        }
       ?>
    </div>
  </div>
</body>
</html>
