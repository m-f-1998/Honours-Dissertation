registerClass = ( e, university_id ) => { // Send POST Request To Register A New Class
  e.preventDefault();
  var fd = new FormData();
  var className = document.getElementById( 'name' ).value;
  var classCode = document.getElementById( 'code' ).value;
  var lecturerEmail = document.getElementById( 'lecturer_email' ).value;
  fd.append( 'className', className );
  fd.append( 'classCode', classCode );
  fd.append( 'lecturerEmail', lecturerEmail ); // Validate Email In JS
  fd.append( 'uid', university_id );
  if ( className == "" || classCode == "" || lecturerEmail == "" ) {
    alert("All Fields Are Required To Register A New Class");
  } else {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if ( expression.test( lecturerEmail.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
      if ( lecturerEmail.endsWith( ".ac.uk" ) ) { // Must Be Education Email
        $.ajax({
          url: './classRegister.php',
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
    }
  }
};

deleteClass = ( e, class_id ) => { // Delete A Class From The Database
  e.preventDefault();
  var fd = new FormData();
  fd.append( 'classID', class_id );
  if ( class_id == "" ) {
    alert("The ID Of Your Class Must Be Provided");
  } else {
    $.ajax({
      url: './classDelete.php',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function( data ) {
        if ( data == true ) {
          window.location.href = 'https://www.matthewfrankland.co.uk/dissertation/administrator-portal/create-class';
        } else {
          alert( data );
        }
      }
    });
  }
};
