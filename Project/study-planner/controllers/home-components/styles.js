import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: login-register-home/Styles
   Author: Matthew Frankland
   Description: Common Styles For Home Page, Login And Register
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 30,
    borderColor: "#BEBEBE",
    borderBottomWidth: 0.4
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  errorText: {
    height: 20,
    color: "#F8262F",
    marginTop: 10,
    marginBottom: 5
  },
  back: {
    width: "100%",
    alignItems: 'center',
    textAlign: 'center'
  }
} );
