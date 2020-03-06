registerUser = ( e, university_id ) => {
  e.preventDefault();
  var fd = new FormData();
  var email = document.getElementById( 'email' ).value;
  var forename = document.getElementById( 'forename' ).value;
  var surname = document.getElementById( 'surname' ).value;
  var pass = document.getElementById( 'pass' ).value;
  var terms = document.getElementById( 'terms' ).value;
  fd.append( 'email', email );
  fd.append( 'forename', forename );
  fd.append( 'surname', surname );
  fd.append( 'pass', pass );
  fd.append( 'uid', university_id );
  if ( email == "" || forename == "" || surname == "" ) {
    alert("All Fields Are Required To Register A Lecturer");
  } else {
    if ( !terms ) {
      alert("Terms and Conditions Must Be Accepted");
    } else {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if ( expression.test( email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
        if ( email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
          $.ajax({
            url: 'https://www.matthewfrankland.co.uk/dissertation/login/admin-register.php',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function( data ) {
              if ( data == true ) {
                window.location.reload( false );
              } else {
                alert( data );
              }
            }
          });
        } else {
          alert( "Email Address Must Be An Educational Address" );
        }
      } else {
        alert( "Please Enter A Valid Email" );
      }
    }
  }
};
