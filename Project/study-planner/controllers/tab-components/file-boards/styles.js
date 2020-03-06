import { StyleSheet, Dimensions } from 'react-native';

/*
  ==========================================
   Title: Styles For File Boards
   Author: Matthew Frankland
   Description: Common Styles Between File Boards Component
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    position: 'absolute',
    paddingTop: '15%',
    flex: 1,
    backgroundColor: '#0B345A',
    height: Dimensions.get( 'window' ).height,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center'
  },
  rowButton: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  openTouch: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: '#6b41de'
  },
  educationInput: {
    width: '70%',
    alignSelf: 'center',
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
    borderColor: "#BEBEBE",
    borderBottomWidth: 0.4,
    color: '#FFF'
  },
  noClass: {
    marginTop: 10,
    backgroundColor: "darkgray",
    borderTopWidth: 2,
    borderTopColor: "white",
    padding: 10
  }
} );
