<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET');

?>

<!DOCTYPE html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <link rel="stylesheet" href="./styles.css">
    <script>
    $(function() {
      $('#form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: './resetFunc.php',
            data: $('form').serialize(),
            success: function (data) {
                alert(data);
            }
        });
      });
    });
    </script>
</head>
<body>
  <h2>Reset Your Account Password</h2>
  <div class='container'>
      <div class='regisFrm'>
          <form id="form" method='post'>
              <input type='password' name='password' placeholder='NEW PASSWORD' required=''>
              <input type='password' name='confirm_password' placeholder='CONFIRM PASSWORD' required=''>
              <div class='send-button'>
                  <input type='hidden' name='id' value='<?php echo $_REQUEST['code']; ?>'/>
                  <input type='hidden' name='email' value='<?php echo $_REQUEST['email']; ?>'/>
                  <input type='submit' name='resetSubmit' value='RESET PASSWORD'>
              </div>
          </form>
      </div>
  </div>
</body>
</html>
