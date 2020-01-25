import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: Styles For Edit Profile
   Author: Matthew Frankland
   Description: Styles For Editing Profile Component
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
    paddingLeft: 10
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  text: {
    height: 20,
    textAlign: 'center',
    paddingBottom: 30
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  }
} );
