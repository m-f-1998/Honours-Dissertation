<?php
session_start();

/**
 *
 * Send POST Request To Create New Message Thread
 *
 */
function newThread() {
  $url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/newMessageThread.php';
  $data = array( 'session_id' => $_SESSION[ 'code' ], 'email_recipient' => $_POST[ 'email' ] );

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

if( isset($_POST['email']) ) {
   echo newThread();
}

?>
