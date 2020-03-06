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
  <script src="./messages.js"></script>
  <title>Lecturer Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img src="../favicon.png" width="150" height="150">
      <div class="topnav" id="nav">
        <a class="active" href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/messenger">Messenger</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details">Details</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/files">Files</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/calendar">Calendar</a>
        <a href="https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/notifications">Notifications</a>
        <a href="javascript:void(0);" class="icon" onclick="mobileBar()">
          <i class="fa fa-bars"></i>
        </a>
      </div>
      <?php
        $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/checkValid.php';
        $data = array( 'session_id' => $_SESSION[ 'code' ] );
        $options = array(
          'http' => array(
            'method'  => 'POST',
            'content' => http_build_query($data)
          )
        );
        $context  = stream_context_create($options);
        $result = json_decode(file_get_contents($url, false, $context), true);

        if ( $result[ 'error' ]) {
          
          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/getMessages.php';
          $data = array( 'session_id' => $_SESSION[ 'code' ], 'thread_id' => $_GET[ 'id' ] );
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
            )
          );
          $context  = stream_context_create($options);
          $info = json_decode(file_get_contents($url, false, $context), true);
          $start = "<h3 style='margin:0; text-align:center'>Messaging: ".$_GET["email"]."</h3><table style='width:100%;'>";

          foreach( $info["message"] as $data ) {
            if ( $data["to_email"] == $_SESSION["account"]["email"] ) {
              $start .= "<tr style='border-spacing:5em;'>
                          <td style='background-color: blue; width:100%;'>
                            <div>
                              <p style='display: inline-block; text-align:right; width:98%; margin-right:1%; color:white;'>"
                                .$data["creation_date"].' '.$data["creation_time"].
                              "<br /></p>
                            </div>
                            <p style='display: inline-block; text-align:left; margin-left:1%; width:98%; color:white;'>"
                              .$data["message"].
                            "
                          </td>
                        </tr>";
            } else {
              $start .= "<tr style='border-spacing:5em;'>
                          <td style='background-color: green;'>
                            <div>
                              <p style='display: inline-block; text-align:left; width:98%; margin-left:1%; color:white;'>"
                                .$data["creation_date"].' '.$data["creation_time"].
                              "<br /></p>
                            </div>
                            <p style='display: inline-block; text-align:right; margin-right:1%; width:98%; color:white;'>"
                              .$data["message"].
                            "
                          </td>
                        </tr>";
            }
          }

          $start .= '</table><form onSubmit="sendMessage(event, `'.$_GET["id"].'`, `'.$_GET["email"].'`);" style="margin-top: 30px;">
            <fieldset>
              <legend>Send Message</legend>
              Message:<br><br>
              <textarea style="width:100%; height:80px;" id="message" value="" maxlength="500"></textarea>
              <br><br>
              <input type="submit" value="Submit">
            </fieldset>
          </form>';

          echo($start);

        }
       ?>
    </div>
  </div>
</body>
</html>
