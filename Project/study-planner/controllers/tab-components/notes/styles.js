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
    height: Dimensions.get( 'window' ).height
  },
  row: {
    borderTopColor: 'black',
    borderTopWidth: 0.5,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    flex: 1
  },
  noNote: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center'
  },
  rowText: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  rowButton: {
    flex: 1,
    width: '50%',
    justifyContent: 'flex-end'
  },
  rowDelete: {
    flex: 1,
    width: '50%',
    justifyContent: 'flex-end'
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  rich: {
    minHeight: 300,
    flex: 1
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF'
  },
  scroll : {
    backgroundColor:'#ffffff'
  }
} );
