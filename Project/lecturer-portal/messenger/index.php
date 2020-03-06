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
        $data = array('session_id' => $_SESSION['code']);
        $options = array(
          'http' => array(
            'method'  => 'POST',
            'content' => http_build_query($data)
         )
       );
        $context  = stream_context_create($options);
        $result = json_decode(file_get_contents($url, false, $context), true);

        if (include('../check-validity.php')) {

          echo ('<script>window.location.replace("https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/");</script>');

        } else {

          $url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/getThreads.php'; // Get All Message Threads Associated With Lecturer
          $data = array('session_id' => $_SESSION['code']);
          $options = array(
            'http' => array(
              'method'  => 'POST',
              'content' => http_build_query($data)
           )
         );
          $context  = stream_context_create($options);
          $response = json_decode(file_get_contents($url, false, $context), true);

          $start = '
          <a href="../logout.php" style="text-align: center;">Log Out</a>
          <h1 style="margin:0;"> Message Threads </h1>
          <p id="response" style="display:none;"></p><div>';

          $dict = array();
          foreach($response["message"] as $data) { // Swap User Details If Reversed
            foreach($data as $thread) {
              $thread["is_lecturer"] = $thread["is_lecturer"] == 0 ? "Student" : "Lecturer";
              if ($thread["recipient_email"] == $_SESSION['account']['email']) {
                $original = $thread["originating_user"];
                $email = $thread["original_email"];
                $forename = $thread["original_forename"];
                $surname = $thread["original_surname"];
                $profile_pic = $thread["original_profile_pic"];

                $thread["original_profile_pic"] = $thread["recipient_profile_pic"];
                $thread["original_surname"] = $thread["recipient_surname"];
                $thread["original_forename"] = $thread["recipient_forename"];
                $thread["original_email"] = $thread["recipient_email"];
                $thread["originating_user"] = $thread["recipient_user"];
                $thread["recipient_profile_pic"] = $profile_pic;
                $thread["recipient_surname"] = $surname;
                $thread["recipient_forename"] = $forename;
                $thread["recipient_email"] = $email;
                $thread["recipient_user"] = $original;
                $dict[$thread["recipient_email"]] = $thread;
              } else {
                $dict[$thread["recipient_email"]] = $thread;
              }
            }
          }

          foreach($dict as $data) {
            if ($data["privacy"] == 1) {
              if ($data["recipient_profile_pic"] != NULL) {
                $start .= '<div style="margin: 20px; display:inline-block; width:fit-content;">
                              <img style="object-fit: cover; width: 100px; height: 100px;" src="'.$data["recipient_profile_pic"].'" alt="recipient_profile_pic">
                              <p style="margin:0;">';
                                if ($data['recipient_forename'] != '' && $data['recipient_surname'] != '') {
                                  $start .= '<b>'
                                    .$data['recipient_forename'].' ' . $data['recipient_surname']. ' - ' . $data['is_lecturer'].
                                  '</b><br />';
                                }
                                $start .= $data['recipient_email'].'<br />
                                <button id="delete" onclick="deleteMessage(event, `'.$data["id"].'`)" type="submit"><i class="fa fa-trash"></i></button>
                                <button id="edit" onclick="editMessage(event, `'.$data["id"].'`, `'.$data['recipient_email'].'`)" type="submit"><i class="fa fa-pencil-square-o"></i></button>
                              </p>
                            </div>';
              } else {
                $start .= '<div style="margin:20px; display:inline-block; width:fit-content;">
                              <p style="margin:0;">';
                                if ($data['recipient_forename'] != '' && $data['recipient_surname'] != '') {
                                  $start .= '<p style="margin:0;padding-bottom:5px;"><b>'
                                    .$data['recipient_forename'].' ' . $data['recipient_surname']. ' - ' . $data['is_lecturer'].
                                  '</b></p>';
                                }
                                $start .= '<p style="margin:0;padding-bottom:8px;">' . $data['recipient_email'].'</p>
                                <button id="delete" onclick="deleteMessage(event, `'.$data["id"].'`)" type="submit"><i class="fa fa-trash"></i></button>
                                <button id="edit" onclick="editMessage(event, `'.$data["id"].'`, `'.$data['recipient_email'].'`)" type="submit"><i class="fa fa-pencil-square-o"></i></button><br />
                              </p>
                            </div>';

              }
            } else {
              $start .= '<div style="margin:20px; display:inline-block; width:fit-content;">
                            <p style="margin:0;">'.$data['recipient_email'].
                              '<br />
                              <b>'
                                . $data['is_lecturer'].
                              '</b><br />
                              <button id="edit" onclick="editMessage(event, `'.$data["id"].'`, `'.$data['recipient_email'].'`)" type="submit"><i class="fa fa-pencil-square-o"></i></button><br />
                            </p>
                          </div>';
            }
          }

          $start .= '</div><form onSubmit="newThread(event, `'.$_SESSION['account']['email'].'`);" style="margin-top: 30px;">
            <fieldset>
              <legend>Add A New Thread</legend>
              Email of Recipient:<br><br>
              <input type="email" id="email" value="">
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
