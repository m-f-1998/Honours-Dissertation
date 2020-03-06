<?php
session_start();

/**
 *
 * Send POST Request To Send New Message In Thread
 *
 */
function sendMessage() {
  $url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/sendMessages.php';
  $data = array( 'session_id' => $_SESSION[ 'code' ], 'email' => $_POST[ 'email' ], 'message_text' => $_POST[ 'message' ], 'thread_id' => $_POST[ 'id' ] );

  $options = array(
    'http' => array(
      'method'  => 'POST',
      'content' => http_build_query($data)
    )
  );

  $context  = stream_context_create($options);
  $result = json_decode(file_get_contents($url, false, $context), true);

  if ( $result[ "error" ] )
    return("ERROR: " . $result[ "message" ]);
  else {
    return(true);
  }
}

if( isset($_POST['email']) && isset($_POST['id']) && isset($_POST['message']) ) {
   echo sendMessage();
}

?>
