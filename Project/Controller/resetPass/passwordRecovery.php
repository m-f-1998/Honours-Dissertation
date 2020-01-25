<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET');

?>

<!DOCTYPE html>

<head>
    <script src='http://code.jquery.com/jquery-1.9.1.js'></script>
    <script>
    $(function () {
      $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'resetFunc.php',
            data: $('form').serialize(),
            success: function (data) {
                alert(data);
            }
        });
      });
    });
    </script>
</head>

<h2>Reset Your Account Password</h2>
<div class='container'>
    <div class='regisFrm'>
        <form action='userAccount.php' method='post'>
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

<style>
    h2 {
        text-align: center;
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    .container {
        width: 40%;
        margin: 0 auto;
        background-color: #f7f7f7;
        color: #757575;
        font-family: 'Raleway', sans-serif;
        text-align: left;
        padding: 30px;
    }
    .container p {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 20px;
    }
    .regisFrm input[type='text'], .regisFrm input[type='email'], .regisFrm input[type='password'] {
        width: 94.5%;
        padding: 10px;
        margin: 10px 0;
        outline: none;
        color: #000;
        font-weight: 500;
        font-family: 'Roboto', sans-serif;
    }
    .send-button {
        text-align: center;
        margin-top: 20px;
    }
    .send-button input[type='submit'] {
        padding: 10px 0;
        width: 60%;
        font-family: 'Roboto', sans-serif;
        font-size: 18px;
        font-weight: 500;
        border: none;
        outline: none;
        color: #FFF;
        background-color: #2196F3;
        cursor: pointer;
    }
    .send-button input[type='submit']:hover {
        background-color: #055d54;
    }
    a.logout{
        float: right;
    }
    p.success{
        color:#34A853;
    }
    p.error{
        color:#EA4335;
    }
</style>

</html>
