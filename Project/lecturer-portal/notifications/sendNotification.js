// Functions Below Are Requests To Controller //

sendNotification = ( e ) => {
  e.preventDefault();
  var email = null;
  var classString = null;
  if ( $( "#switch" ).val() == "Switch From Individual To Class Notification" ) {
    email = document.getElementById( 'email' ).value;
  } else {
    classString = $( '#class :selected' ).val();
  }
  var title = document.getElementById( 'title' ).value;
  var body = document.getElementById( 'body' ).value;
  var fd = new FormData();
  fd.append( 'title', title );
  fd.append( 'body', body );
  if ( email == null ) {
    fd.append( 'class', classString );
    $.ajax( {
      url: './notificationRequest.php',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function( data ) {
        alert( data );
      }
    } );
  } else {
    if ( email == "" || title == "" ) {
      alert("Email And Title Fields Are Required");
    } else {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if ( expression.test( email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
        if ( email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
          fd.append( 'email', email );
          $.ajax({
            url: './notificationRequest.php',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function( data ) {
              alert( data );
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
}

$( document ).ready( function() { // Elements To Change On Switching From Sending Notification To Individual To Notification To Class And Vice Versa
  $( '#switch' ).on( 'click', function () {
    if ( $( this ).val() == "Switch From Individual To Class Notification" ) {
      $( this ).val( 'Switch From Class To Individual Notification' );
      $( "#recipient-email" ).css( "display", "none" );
      $( "#recipient-class" ).removeAttr( "style" );
      $( "#title-class" ).css( "display", "none" );
    } else {
      $( this ).val( "Switch From Individual To Class Notification" );
      $( "#recipient-email" ).removeAttr( "style" );
      $( "#title-class" ).removeAttr( "style" );
      $( "#recipient-class" ).css( "display", "none" );
    }
  });
});

mobileBar = () => { // Show Mobile Nav Bar And Vice Versa
  var x = document.getElementById( "nav" );
  if ( x.className === "topnav" ) {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
