import { StyleSheet, Dimensions } from 'react-native';

/*
  ==========================================
   Title: Styles For Notes
   Author: Matthew Frankland
   Description: Common Styles Between Notes View And Component
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
    justifyContent: 'flex-end'
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
