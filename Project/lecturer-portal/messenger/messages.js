// Functions Below Are Requests To Controller //

deleteMessage = ( e, id ) => {
  e.preventDefault();
  var fd = new FormData();
  fd.append( 'id', id );
  $.ajax({
    url: './messageDelete.php',
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
};

newThread = ( e, account_email ) => {
  e.preventDefault();
  var fd = new FormData();
  var email = document.getElementById( 'email' ).value;
  fd.append( 'id', email );
  if ( email == "" ) {
    alert("Email Is Required To Open New Thread");
  } else {
    if ( account_email == email ) {
      alert("You Cannot Contact Yourself");
    } else {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if ( expression.test( email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
        if ( email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
          fd.append( 'email', email );
          $.ajax({
            url: './newThread.php',
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

sendMessage = ( e, id, email ) => {
  e.preventDefault();
  var message = document.getElementById( 'message' ).value;
  var fd = new FormData();
  fd.append( 'message', message );
  fd.append( 'id', id );
  fd.append( 'email', email );
  if ( message == "" ) {
    alert("Message Text Is Required");
  } else {
    $.ajax({
      url: './sendMessage.php',
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
  }
};

editMessage = (e, id, email) => { // Move To Page For Editing Message
  e.preventDefault();
  window.location = './openMessage.php?id=' + id + '&email=' + email;
}

mobileBar = () => { // Show Mobile Nav Bar And Vice Versa
  var x = document.getElementById( "nav" );
  if ( x.className === "topnav" ) {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
};
