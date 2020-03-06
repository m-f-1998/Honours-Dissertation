<?php
session_start();

/**
 *
 * Send POST Request To Delete Event To Database
 *
 */
function deleteEvent() {
  $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/lecturer/calendar/deleteEvent.php';
  $data = array( 'session_id' => $_SESSION[ 'code' ], 'id' => $_POST[ 'id' ] );

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
   echo deleteEvent();
}

?>
