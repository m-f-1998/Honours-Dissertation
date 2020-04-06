import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: more-components/edit-profile
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
  textInput: {
    width: '100%',
    height: 40,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    borderColor: "#BEBEBE",
    borderBottomWidth: 0.4,
    color: '#FFF'
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  text: {
    height: 20,
    textAlign: 'center',
    paddingBottom: 30,
    color: 'white'
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  }
} );
