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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="./files.js"></script>
  <title>Lecturer Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/files">Files</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details">Details</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/messenger">Messenger</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/calendar">Calendar</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications">Notifications</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php

        if (include('../check-validity.php')) {

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/files/getFileInfo.php'; // Get Info On Current File To Edit
          $data = array('session_id' => $_SESSION['code'], 'id' => $_GET['id']);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
           )
         );
          $context  = stream_context_create($options);
          $info = json_decode(file_get_contents($url, false, $context), true);

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/getClasses.php'; // Get All Classes Lectuer Teaches
          $data = array('session_id' => $_SESSION['code']);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
           )
         );
          $context  = stream_context_create($options);
          $result = json_decode(file_get_contents($url, false, $context), true);

          /* Construct HTML String Based On Retrieved Data */

          $return = '<form onSubmit="updateFile(event);" style="margin-top: 30px;">
            <fieldset>
              <legend>Edit Document</legend>
              <div id="recipient-class">
                <br>Class:<br><br>
                <select id="class">';
                $class = "";
                foreach($result["message"] as $data) {
                  if ($class != $data["class_name"]) {
                    if ($info['message'][0]['class'] == $data["class_name"]) {
                      $return .= "<option id='" . $data["class_name"] . "' selected='selected'>".$data["class_name"]."</option>";
                    } else {
                      $return .= "<option id='" . $data["class_name"] . "'>".$data["class_name"]."</option>";
                    }
                    $class = $data["class"];
                  }
                }
              $return .= '
                </select>
              </div>
              <br>
              Title:<br><br>
              <input type="text" id="title" value="'.$info['message'][0]['title'].'" maxlength="40">
              <br><br>
              Link:<br><br>
              <input type="text" id="link" value="'.$info['message'][0]['link'].'" maxlength="100">
              <br><br>
              <input type="hidden" id="id" value="'.$info['message'][0]['id'].'" maxlength="178">
              <br><br>
              <input type="submit" value="Submit">
            </fieldset>
          </form>';

          echo($return);

        }
       ?>
    </div>
  </div>
</body>
</html>
