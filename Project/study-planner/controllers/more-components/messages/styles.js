import { StyleSheet, Dimensions } from 'react-native';

/*
  ==========================================
   Title: Styles For Messaging
   Author: Matthew Frankland
   Description: Styles For Sending Messages Between Lecturers and Students
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#0B345A',
    height: Dimensions.get( 'window' ).height,
    width: '100%'
  },
  emailInvalid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B345A',
  },
  row: {
    borderTopColor: 'white',
    borderTopWidth: 0.5,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    flex: 1
  },
  messageRow: {
    borderTopColor: 'white',
    borderTopWidth: 0.5,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    width: '100%',
    padding: 10,
    marginTop: 10,
    flex: 1
  },
  noMessage: {
    flex: 1,
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  rowText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  rowButton: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  rowDelete: {
    flex: 1,
    width: '50%',
    justifyContent: 'center'
  },
  rowDeleteText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold'
  },
  deleteTouch: {
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 5
  },
  openTouch: {
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
    marginLeft: 5,
    backgroundColor: '#6b41de'
  },
  image: {
    width: 75,
    height: 75,
    marginLeft: 10,
    borderRadius: 150 / 2,
    overflow: "hidden"
  },
  rightAlign: {
    textAlign: 'right',
    color: 'white',
    width: '100%'
  },
  leftAlign: {
    textAlign: 'left',
    color: 'white',
    width: '100%'
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
} );
