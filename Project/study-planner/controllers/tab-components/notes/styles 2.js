import { StyleSheet, Dimensions } from 'react-native';

/*
  ==========================================
   Title: tab-components/notes
   Author: Matthew Frankland
  ==========================================
*/

export default StyleSheet.create( {
  container: {
    position: 'absolute',
    paddingTop: '15%',
    flex: 1,
    backgroundColor: '#0B345A',
    height: Dimensions.get( 'window' ).height
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
  noNote: {
    flex: 1,
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  rowText: {
    flex: 1,
    justifyContent: 'flex-start',
    color: 'white',
    fontWeight: 'bold'
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
    width: "18%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 5
  },
  openTouch: {
    width: "18%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 5,
    backgroundColor: '#6b41de'
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#0B345A',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    backgroundColor: '#0B345A',
  },
  rich: {
    minHeight: 300,
    flex: 1
  },
  richBar: {
    height: 50,
    backgroundColor: '#0B345A',
    color: 'white'
  },
  scroll : {
    backgroundColor:'#ffffff'
  }
} );
