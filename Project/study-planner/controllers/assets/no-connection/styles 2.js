import { StyleSheet, Dimensions } from 'react-native';

/*
  ==========================================
   Title: assets/no-connection/style
   Author: Matthew Frankland
  ==========================================
*/


export default StyleSheet.create( {
  container: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: Dimensions.get( 'window' ).width,
    position: 'absolute',
    top: 0,
    zIndex: 1
  },
  text: {
    color: '#fff',
    position: 'absolute',
    bottom: 5
  }
} );
