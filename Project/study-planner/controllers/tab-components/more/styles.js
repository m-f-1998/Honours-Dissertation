import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: Styles For More Tab
   Author: Matthew Frankland
   Description: Stylesheet For More Page
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    flex: 1,
    paddingLeft: '2%',
    paddingRight: '2%',
    paddingTop: '19%'
  },
  buttonsOne: {
    paddingBottom: '4.5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 150 / 2,
    overflow: "hidden"
  },
  accountName: {
    paddingBottom: '4%',
    paddingTop: '2%',
    textAlign: 'center'
  },
  buttonsTwo: {
    paddingBottom: '7.5%',
    paddingTop: '7.5%'
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 10
  },
  footerText: {
    textAlign: 'center',
    fontStyle: 'italic'
  }
} );
