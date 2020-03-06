<?php
session_start();

/**
 *
 * Send POST Request To Delete Message Thread
 *
 */
function deleteMessage() {
  $url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/deleteMessages.php';
  $data = array( 'session_id' => $_SESSION[ 'code' ], 'thread_id' => $_POST[ 'id' ] );

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

if( isset($_POST['id']) ) {
   echo deleteMessage();
}

?>
