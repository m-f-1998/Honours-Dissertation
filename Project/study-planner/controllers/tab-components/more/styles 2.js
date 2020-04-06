import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: tab-components/more
   Author: Matthew Frankland
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    flex: 1,
    paddingLeft: '2%',
    paddingRight: '2%',
    paddingTop: '19%',
    backgroundColor: '#0B345A'
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
    textAlign: 'center',
    color: 'white'
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
    fontStyle: 'italic',
    color: 'white'
  }
} );
