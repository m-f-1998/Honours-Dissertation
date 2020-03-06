import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title: home-components/style
   Author: Matthew Frankland
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: '#0B345A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 30,
    borderColor: "#BEBEBE",
    borderBottomWidth: 0.4,
    color: '#FFF',
    marginBottom: 30
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
  }
} );
