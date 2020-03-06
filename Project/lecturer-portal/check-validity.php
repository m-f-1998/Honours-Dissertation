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

  return $result['error'];
?>
