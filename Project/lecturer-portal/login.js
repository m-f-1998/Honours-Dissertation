loginRequest = () => {  // Process Login Request In Controller
  var email = document.getElementById( 'field_email' ).value;
  var pass = document.getElementById( 'field_password' ).value;
  if ( email == "" || pass == "" ) {
    document.getElementById( 'error' ).innerHTML =  "Both Fields Are Required To Log In";
  } else {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if ( expression.test( email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
      if ( email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
        var fd = new FormData();
        fd.append( 'email', email );
        fd.append( 'password', pass );
        $.ajax({
          url: 'https://www.matthewfrankland.co.uk/dissertation/login/login.php',
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function( data ) {
            if ( data != undefined ) {
              data = JSON.parse( data );
              if ( data[ "error" ] )
                document.getElementById( 'error' ).innerHTML =  "An Unexpected Error Occured<br/>" + data[ "message" ];
              else {
                if ( data[ "account" ][ 0 ][ "is_lecturer" ] == 1 ) {
                  if ( data[ "account" ][ 0 ][ "email_verified" ] == 1 ) {
                    delete data[ "account" ][ 0 ][ "email_verified" ];
                    delete data[ "account" ][ 0 ][ "is_admin" ];
                    delete data[ "account" ][ 0 ][ "is_lecturer" ];
                    var code = data[ "code" ];
                    $.redirect( 'https://www.matthewfrankland.co.uk/dissertation/lecturer-portal/details/', { account: data[ "account" ][ 0 ], code: code } );
                  } else {
                    document.getElementById( 'error' ).innerHTML =  "Please Verify Your Email Before You Login";
                  }
                } else {
                  document.getElementById( 'error' ).innerHTML =  "You Must Be A Lecturer To Use This Portal";
                }
              }
            }
          }
        });
      } else {
        document.getElementById( 'error' ).innerHTML =  "Your Registered Email Must Be An Educational Address";
      }
    } else {
      document.getElementById( 'error' ).innerHTML =  "Please Enter A Valid Email";
    }
  }
}

forgotPass = () => { // Send Forgotten Password Email If Email Address Is Valid
  var email = document.getElementById( 'field_email' ).value;
  if ( email == "" ) {
    document.getElementById( 'error' ).innerHTML =  "Your Registered Email Is Required To Reset Your Password";
  } else {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if ( expression.test( email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
      if ( email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
        var fd = new FormData();
        fd.append( 'email', email );
        $.ajax({
          url: 'https://www.matthewfrankland.co.uk/dissertation/resetPass/emailReset.php',
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function( data ) {
            if ( data != undefined ) {
              data = JSON.parse( data );
              if ( data[ "error" ] )
                document.getElementById( 'error' ).innerHTML =  "An Unexpected Error Occured<br/>" + data[ "message" ];
              else {
                alert('A Reset Email Has Been Sent To You')
              }
            }
          }
        });
      } else {
        document.getElementById( 'error' ).innerHTML =  "Your Registered Email Must Be An Educational Address";
      }
    } else {
      document.getElementById( 'error' ).innerHTML =  "Please Enter A Valid Email";
    }
  }
}
