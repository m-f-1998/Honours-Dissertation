import { StyleSheet, Dimensions } from 'react-native';

/*
  ==========================================
   Title: No Connection
   Author: Matthew Frankland
   Description: StyleSheet
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
  shortContainer: {
    height: 38
  },
  largeContainer: {
    height: 60
  },
  text: {
    color: '#fff',
    position: 'absolute',
    bottom: 5
  }
} );
