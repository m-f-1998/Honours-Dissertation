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
  <script src="./events.js"></script>
  <title>Lecturer Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/calendar">Calendar</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details">Details</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/files">Files</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/messenger">Messenger</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications">Notifications</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php
        if (include('../check-validity.php')) {

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/getClasses.php'; // Get Classes Lecturer Teaches
          $data = array( 'session_id' => $_SESSION['code']);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
            )
          );
          $context  = stream_context_create($options);
          $classes = json_decode(file_get_contents($url, false, $context), true);

          $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/calendar/getEvents.php'; // Event Data Associated With A Lecturer
          $data = array('session_id' => $_SESSION['code']);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
            )
          );
          $context  = stream_context_create($options);
          $result = json_decode(file_get_contents($url, false, $context), true);

          /* Build HTML From Retrieved Data */

          $class = "";
          $return = "<h1>My Class Events</h1><i>Recommended Browser: Chrome</i>";
          $flag = true;
          foreach($result["message"] as $data) {
            if ($class != $data["class"]) {
              if ($flag == false) {
                $return .= "</div>";
              }
              $flag = false;
              $return .= "<div><h3>".$data["class"]."</h3>";
            }
            $class = $data["class"];
            $return .= $data["title"] . "<br /> Due:
              ".$data["date_due"]." ".$data["time_due"]."
              <button id='delete' onclick='deleteEvent(event, `".$data["id"]."`)' type='submit'><i class='fa fa-trash'></i></button>
              <button id='edit' onclick='editEvent(event, `".$data["id"]."`)' type='submit'><i class='fa fa-pencil-square-o'></i></button><br><br>";
          }

          $return .= '</div>
                      <form onSubmit="addEvent(event);" style="margin-top: 30px;">
                        <fieldset>
                          <legend>Add A New Event</legend>
                          <div id="recipient-class">
                            <br>Class:<br><br>
                            <select id="class">';
          $class = "";
          $flag = true;
          foreach( $classes["message"] as $data ) {
            if ($class != $data["class_name"]) {
              if ($flag) {
                $return .= "<option id='" . $data["class_name"] . "' selected='selected'>".$data["class_name"]."</option>";
                $flag = false;
              } else {
                $return .= "<option id='" . $data["class_name"] . "'>".$data["class_name"]."</option>";
              }
              $class = $data["class"];
            }
          }

          $return .= '
              </select>
            </div>
            <br>Title:<br><br>
            <input type="text" id="title" value="" maxlength="40">
            <br><br>Due:<br><br>
            <input type="datetime-local" id="due" step="1" max="9999-12-30T00:00" value="">
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
