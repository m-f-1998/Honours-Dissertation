/*
  ==========================================
   Title: XHRRequest
   Author: Matthew Frankland
   Description: Custom XHRRequest For Making POST Calls. fetch() Was Fetch Being Unpredictable With No info.plist (No Transport Security)
  ==========================================
*/

exports.getFetch = ( url, form_data, done ) => {
  var request = new XMLHttpRequest();

  request.open( 'POST', url );
  request.timeout = 5000;
  request.onload = function () {
    done( null, request.response ); // Pass Back Function
  };
  request.onerror = function () {
    done( request.response );
  };
  request.ontimeout = function () {
    done( null, null, true );
  };
  
  request.send( form_data );
}

export default exports;
