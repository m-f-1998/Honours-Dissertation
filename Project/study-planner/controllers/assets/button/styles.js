import { StyleSheet } from 'react-native';

/*
  ==========================================
   Title:  Custom Button
   Author: Matthew Frankland
   Description: StyleSheet
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 12,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth
  },
  containerEnabled: {
    opacity: 1
  },
  containerDisabled: {
    opacity: 0.3
  },
  text: {
    textAlign: "center",
    height: 20
  },
  nonMainText: {
    color: "black",
  },
  mainText: {
    color: "white",
    fontWeight: 'bold'
  },
  nonMainContainer: {
    backgroundColor: 'white'
  },
  mainContainer: {
    backgroundColor: "#6b41de"
  }
} );
