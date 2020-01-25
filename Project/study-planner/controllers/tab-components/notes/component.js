import React from 'react';
import { Text, View, StatusBar, ScrollView, Button, Alert } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import prompt from 'react-native-prompt-android';

import OfflineNotice from "../../assets/no-connection/component.js";
import CustomButton from "../../assets/button/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Notes Component
   Author: Matthew Frankland
   Description: List Of All Notes User Has Stored And Space To Add New Notes
  ==========================================
*/

class Notes_Screen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
    title: 'Notes'
  };

  state = {
    notes: []
  };

  componentDidMount() { // Validity Wiped On This Tab As Landing Page After Login
    this.session = setInterval( ()=> this.wipe_session(), 3600000 ) // Wipe Cache Of Session ID
    this.validity = setInterval( ()=> this.wipe_validity(), 1800000 ) // Wipe Cache Of Email And Education Validity
    this.get_notes();
  }

  async wipe_session() { // On Session Expiring Require Login
    try {
      clearInterval( this.session ); // Clear All Running Intervals
      clearInterval( this.validity );
      clearInterval( this.validity_controller_interval );
      global.email_verified = null; // Set Verification Cache Empty
      global.education_valid = null;
      const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: 'Home' } ) ] } ); // Return To Login Screen
      this.props.navigation.dispatch( resetAction );
    } catch ( exception ) {
      console.log( exception );
    }
  }

  async wipe_validity() { // On Validity Expiring, Wipe Cache So Net Call Is Run
    try {
      global.email_verified = null;
      global.education_valid = null;
    } catch ( exception ) {
      console.log( exception );
    }
  }

  async get_notes() { // Get Saved Notes From Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/notes.php';
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          response = JSON.parse( response );
          if ( response[ 'error' ] ) {
            Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
          } else {
            that.setState( { notes: response[ 'message' ] } );
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  async delete_note( note ) { // Delete A Note From The Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    form_data.append( 'note_id', note[ "id" ] );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/deleteNote.php';
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          response = JSON.parse( response );
          if ( response[ 'error' ] ) {
            Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
          } else {
            var index = that.state.notes.indexOf(note);
            var newArry = that.state.notes;
            if (index !== -1) newArry.splice(index, 1);
            that.setState( { notes: newArry } );
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  new_note = async function() { // Add A New Note With No Body To It
    var id = await SecureStore.getItemAsync( 'session_id' );
    prompt( 'Enter Note Title', '', [ {text: 'Cancel', style: 'cancel'},
     { text: 'OK', onPress: noteTitle => {
       const form_data = new FormData();
       form_data.append( 'session_id', id );
       form_data.append( 'note_title', noteTitle );
       var that = this;
       const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/newNote.php';
       require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
         if ( timeout ) {
           Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
         } else {
           if ( ! err ) {
             response = JSON.parse( response );
             if ( response[ 'error' ] ) {
               Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
             } else {
               that.get_notes();
             }
           } else {
             err = JSON.parse( err );
             Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
           }
         }
       });
     } },
    ], { cancelable: true } );
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={ styles.container } >
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
        <OfflineNotice />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} bounces={ false } >
          <View style={ [ styles.row, { backgroundColor: 'darkgray' } ] }>
            <CustomButton label={ "Add A New Note" } onPress={ () => this.new_note( this.state.notes ) } />
          </View>
          { ( this.state.notes.length == 0 ) ?
            <View style={ [ styles.row, { backgroundColor: 'darkgray' } ] }>
                <Text style={ styles.noNote } >No Notes Found</Text>
            </View>
          : this.state.notes.map( note =>
            <View key={ note["id"] } style={ [ styles.row, { backgroundColor: '' } ] }>
              <Text style={ styles.rowText } >{ note[ 'title' ] }{ "\n" }{ note['creation_date'] }</Text>
              <Button color="red" title="Delete" onPress={ () => this.delete_note( note ) } style={ styles.rowDelete } />
              <Button title="Open" onPress={ () => navigate( "Notes_Editor", { id: note["id"] } ) } style={ styles.rowButton } />
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

export default Notes_Screen;
