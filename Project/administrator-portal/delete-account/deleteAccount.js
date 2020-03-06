deleteUser = ( e, user_id ) => { // Delete A Lecturer In The Database
  e.preventDefault();
  var fd = new FormData();
  fd.append( 'userID', user_id );
  if ( user_id == "" ) {
    alert("The ID Of The User To Delete Must Be Provided");
  } else {
    $.ajax({
      url: './userDelete.php',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function( data ) {
        if ( data == true ) {
          window.location.href = 'https://www.matthewfrankland.co.uk/dissertation/administrator-portal/delete-account';
        } else {
          alert( data );
        }
      }
    });
  }
};
