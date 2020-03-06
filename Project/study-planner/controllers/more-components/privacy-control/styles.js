import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: more-components/privacy-control
   Author: Matthew Frankland
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#0B345A'
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
    color: 'white'
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerView: {
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
