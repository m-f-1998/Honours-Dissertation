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
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="./sendNotification.js"></script>
  <title>Lecturer Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications">Notifications</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details">Details</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/files">Files</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/messenger">Messenger</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/calendar">Calendar</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php
        $email = '';
        if (isset($_GET['email'])) { // Email Passed From Details Page
          $email = $_GET['email'];
        }

        if (include('../check-validity.php') === TRUE) {

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/getClasses.php'; // Get All Classes That A Lecturer Teaches
          $data = array('session_id' => $_SESSION['code']);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
             )
           );
          $context  = stream_context_create($options);
          $classes = json_decode(file_get_contents($url, false, $context), true);

          /* Construct HTML Based On Retrieved Data */

          $start = '
            <a href="../logout.php" style="text-align: center;">Log Out</a>
            <h1 style="margin:0;"> Send A Notification </h1>
            <p id="response" style="display:none;"></p>
            <div style="text-align: center;">
              <input style="width: 75%; font-family: sans-serif; font-size: 18px;" type="button" id="switch" value="Switch From Individual To Class Notification">
            </div>
            <i> You Can Find Students <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details/"> Email Addresses </a> Here <br /><br /> Notifications Will Be Recieved If Users Allow Push Notifications On Their Device </i>
            <form onSubmit="sendNotification(event);">
              <fieldset>
                <div id="recipient-email">
                  <br>Email:<br><br>
                  <input type="text" id="email" value="'.$email.'">
                </div>
                <div id="recipient-class" style="display:none;">
                  <br>Class:<br><br>
                  <select id="class">';

          $flag = true;
          foreach($classes["message"] as $data) {
            if ($flag) {
              $start .= "<option id='" . $data["class_name"] . "' selected='selected'>".$data["class_name"]."</option>";
              $flag = false;
            } else {
              $start .= "<option id='" . $data["class_name"] . "'>".$data["class_name"]."</option>";
            }
          }

          echo ($start . '
                          </select>
                          </div><br>
                          <div id="title-class">
                            Title:<br><br>
                            <input type="text" id="title" value="" maxlength="40"><br><br>
                          </div>
                          Body:<br><br>
                          <textarea id="body" value="" maxlength="178"></textarea><br><br>
                          <input type="submit" value="Submit">
                        </fieldset>
                      </form>
          ');

        }
       ?>
    </div>
  </div>
</body>
</html>
