<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Administrator Portal - Study Planner">
  <meta name="author" content="Matthew Frankland">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"></head>

  <link rel="stylesheet" href="style.css">
  <link rel="shortcut icon" type="image/png" href="./favicon.png"/>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="./scripts/externals/jquery.redirect.js"></script>
  <script src="./scripts/login.js"></script>

  <title>Administrator Portal</title>
</head>
<body>
  <div id="form_wrapper">
    <div id="form_structure">
      <img src="./favicon.png" width="150" height="150">
      <h1>Higher Education Study Planner<br /><br />Administrator Login</h1>
      <div class="input_container">
        <i class="fas fa-envelope"></i>
        <input placeholder="Email" type="email" name="Email" id="field_email" class='input_field'>
      </div>
      <div class="input_container">
        <i class="fas fa-lock"></i>
        <input  placeholder="Password" type="password" name="Password" id="field_password" class='input_field'>
      </div>
      <input type="submit" value="Login" id='input_submit' class='input_field' onclick="loginRequest();" >
      <p id="error"></p>
      <span>
        <a onclick="forgotPass();">Forgot Password ?</a>
      </span>
    </div>
  </div>
</body>
</html>
