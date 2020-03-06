<?php
session_start();

function sendNotification() {
  $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/notifications/sendNotification.php';

  if (isset($_POST['email'])) {
    $data = array('session_id' => $_SESSION['code'], 'email' => $_POST['email'], 'body' => $_POST['body'], 'title' => $_POST['title']);
  } else {
    $data = array('session_id' => $_SESSION['code'], 'class' => $_POST['class'], 'body' => $_POST['body'], 'title' => $_POST['title']);
  }

  $options = array(
    'http' => array(
      'method'  => 'POST',
      'content' => http_build_query($data)
    )
  );
  $context  = stream_context_create($options);
  $result = json_decode(file_get_contents($url, false, $context), true);

  if ($result["error"])
    return("ERROR: " . $result["message"]);
  else {
    return("Notification Sent To User If They Allow Push Notifications");
  }
}

if( (isset($_POST['email'])||isset($_POST['class'])) && isset($_POST['title']) && isset($_POST['body']) ) {
   echo sendNotification();
}

?>
