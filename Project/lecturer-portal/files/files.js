// Functions Below Are Requests To Controller //

addFile = ( e ) => {
  e.preventDefault();
  var classString = $( '#class :selected' ).val();;
  var title = document.getElementById( 'title' ).value;
  var link = document.getElementById( 'link' ).value;
  if ( link.substring(0, 4) === "www." ) {
    link = "https://" + link;
  } else if ( link.substring(0, 7) === "http://" ) {
    link = link.slice(0, 4) + "s" + link.slice(4);
  }
  var fd = new FormData();
  fd.append( 'title', title );
  fd.append( 'link', link );
  fd.append( 'class', classString );
  if ( title == "" || link == "" ) {
    alert("Title And Link Fields Are Required");
  } else {
    if ( isUrl ( link ) ) {
      $.ajax({
        url: './fileUpload.php',
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
      alert('Link Must Be A Valid HTTPS URI');
    }
  }
};

updateFile = (e) => {
  e.preventDefault();
  var classString = $( '#class :selected' ).val();;
  var title = document.getElementById( 'title' ).value;
  var link = document.getElementById( 'link' ).value;
  if ( link.substring(0, 4) === "www." ) {
    link = "https://" + link;
  } else if ( link.substring(0, 7) === "http://" ) {
    link = link.slice(0, 4) + "s" + link.slice(4);
  }
  var id = document.getElementById( 'id' ).value;
  var fd = new FormData();
  fd.append( 'title', title );
  fd.append( 'link', link );
  fd.append( 'class', classString );
  fd.append( 'id', id );
  if ( title == "" || link == "" ) {
    alert("Title And Link Fields Are Required");
  } else {
    if ( isUrl ( link ) ) {
      $.ajax({
        url: './fileUpdate.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function( data ) {
          if ( data == true ) {
            alert( 'File Updated' );
          } else {
            alert( data );
          }
        }
      });
    } else {
      alert('Link Must Be A Valid HTTPS URI');
    }
  }
};

deleteFile = (e, id) => {
  e.preventDefault();
  var fd = new FormData();
  fd.append( 'id', id );
  $.ajax({
    url: './fileDelete.php',
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

isUrl = ( s ) => { // Check Valid Secure URL
   var regexp = /(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test( s );
}

editFile = ( e, id ) => { // Move To Edit File Page
  e.preventDefault();
  window.location = './editFile.php?id=' + id;
}

mobileBar = () => { // Change Nav Bar To Mobile Format And Vice Versa
  var x = document.getElementById( "nav" );
  if ( x.className === "topnav" ) {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
