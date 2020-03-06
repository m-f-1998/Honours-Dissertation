searchByName = () => { // Search Table In Name Column
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById( "searchBarName" );
  filter = input.value.toUpperCase();
  table = document.getElementById( "dataTable" );
  tr = table.getElementsByTagName( "tr" );
  for ( i = 0; i < tr.length; i++ ) {
    td = tr[ i ].getElementsByTagName( "td" )[ 0 ];
    if ( td && td.id == "data-cell" ) {
      txtValue = td.textContent || td.innerText;
      if ( txtValue.toUpperCase().indexOf(filter) > -1 ) {
        tr[ i ].style.display = "";
      } else {
        tr[ i ].style.display = "none";
      }
    }
  }
}

searchByEmail = () => { // Search Table In Email Column
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById( "searchBarEmail" );
  filter = input.value.toUpperCase();
  table = document.getElementById( "dataTable" );
  tr = table.getElementsByTagName( "tr" );
  for ( i = 0; i < tr.length; i++ ) {
    td = tr[ i ].getElementsByTagName( "td" )[ 1 ];
    if ( td && td.id == "data-cell" ) {
      txtValue = td.textContent || td.innerText;
      if ( txtValue.toUpperCase().indexOf(filter) > -1 ) {
        tr[ i ].style.display = "";
      } else {
        tr[ i ].style.display = "none";
      }
    }
  }
}

mobileBar = () => { // Change Nav Bar To Mobile View And Vice Versa
  var x = document.getElementById( "nav" );
  if ( x.className === "topnav" ) {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
