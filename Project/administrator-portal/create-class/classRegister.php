<?php
session_start();

/**
 *
 * Send POST Request To Add Class To Database
 *
 */
function addEvent() {
  $url = 'https://www.matthewfrankland.co.uk/dissertation/higherFunctions/administrator/classRegister.php';
  $data = array( 'session_id' => $_SESSION[ 'code' ], 'classname' => $_POST[ 'className' ], 'classcode' => $_POST[ 'classCode' ], 'lectureremail' => $_POST[ 'lecturerEmail' ], 'uid' => $_POST[ 'uid' ] );

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

if( isset($_POST['className']) && isset($_POST['classCode']) && isset($_POST['lecturerEmail']) && isset($_POST['uid']) ) {
   echo addEvent();
}

?>
