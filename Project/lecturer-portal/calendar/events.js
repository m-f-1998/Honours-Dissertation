// Functions Below Are Requests To Controller //

addEvent = ( e ) => {
  e.preventDefault();
  var classString = $( '#class :selected' ).val();;
  var title = document.getElementById( 'title' ).value;
  var due = document.getElementById( 'due' ).value;
  var fd = new FormData();
  fd.append( 'title', title );
  fd.append( 'due', due );
  fd.append( 'class', classString );
  if ( title == "" || due == "" ) {
    alert("Title And Due Date Are Required");
  } else {
    if ( isIsoDate ( due ) ) {
      $.ajax({
        url: './addEvent.php',
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
      alert('Date Must Be A Valid ISO Date yyyy-mm-ddThh:mm:ss');
    }
  }
};

updateEvent = ( e ) => {
  e.preventDefault();
  var classString = $( '#class :selected' ).val();;
  var title = document.getElementById( 'title' ).value;
  var due = document.getElementById( 'due' ).value;
  var id = document.getElementById( 'id' ).value;
  var fd = new FormData();
  fd.append( 'title', title );
  fd.append( 'due', due );
  fd.append( 'class', classString );
  fd.append( 'id', id );
  if ( title == "" || due == "" ) {
    alert("Title And Due Date Are Required");
  } else {
    if ( isIsoDate ( due ) ) {
      $.ajax({
        url: './updateEvent.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function( data ) {
          if ( data == true ) {
            alert( 'Event Updated' );
          } else {
            alert( data );
          }
        }
      });
    } else {
      alert('Date Must Be A Valid ISO Date');
    }
  }
};

deleteEvent = ( e, id ) => {
  e.preventDefault();
  var fd = new FormData();
  fd.append( 'id', id );
  $.ajax({
    url: './eventDelete.php',
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

// Helper Functions //

isIsoDate = ( str ) => { // ISO Date Format: yyyy-mm-ddThh:mm:ss
  if (!/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])?/.test(str)) return false;
  return true;
};

editEvent = ( e, id ) => {
  e.preventDefault();
  window.location = './editEvent.php?id=' + id;
};

mobileBar = () => {
  var x = document.getElementById( "nav" );
  if ( x.className === "topnav" ) {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
};
