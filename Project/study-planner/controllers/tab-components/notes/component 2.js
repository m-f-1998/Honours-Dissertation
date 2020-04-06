import React from "react";
import { Text, View, StatusBar, ScrollView, Alert, TouchableOpacity } from "react-native";

import { NavigationActions, StackActions } from "react-navigation";
import * as SecureStore from "expo-secure-store";
import prompt from "react-native-prompt-android";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

import Offline from "../../assets/no-connection/component.js";
import Button from "../../assets/button/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Notes Component
   Author: Matthew Frankland
   Description: React.Component To List Of All Notes User Has Stored And Space To Add New Notes
  ==========================================
*/

class Notes_Screen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
    title: "Notes"
  };

  state = {
    notes: []
  };

  componentDidMount () { // Validity Wiped On This Tab As Landing Page After Login
    this.session = setInterval( ()=> this.wipe_session(), 3600000 ) // Wipe Cache Of Session ID
    this.validity = setInterval( ()=> this.wipe_validity(), 1800000 ) // Wipe Cache Of Email And Education Validity
    this.get_notes();
    SecureStore.getItemAsync( "notifications" ).then( notifications => { // Offer Login By Biometrics If Enabled
      this.setNotifications( notifications );
    } )
  };

  generateToken = async () => {
    var token = await SecureStore.getItemAsync( "notifications-token" );
    if ( token == null ) {
      const { status } = await Permissions.askAsync( Permissions.NOTIFICATIONS );
      if ( status !== "granted" ) {
        Alert.alert( "Sorry Notification Permissions Were Not Granted!", "", [ { text: "Dismiss" } ] );
        return '';
      }
      token = await Notifications.getExpoPushTokenAsync();
    }
    return token
  };

  setNotifications = async ( allowed ) => { // Add Permissions For Notifications
    var token = !allowed ? '' : await this.generateToken();
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "allowed", allowed ? 1 : 0 );
    form_data.append( "token", token );
    const { navigate } = this.props.navigation;
    var that = this;
    require("../../assets/fetch.js").getFetch( "https://www.matthewfrankland.co.uk/dissertation/userFunctions/savePush.php", form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        that.setState( { notifications: false } );
        return;
      } else {
        if ( ! err ) {
          if ( response == undefined ) {
            Alert.alert( "Request Failed", "An Internet Connection Is Required", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            that.setState( { notifications: false } );
          } else {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
              that.setState( { notifications: false } );
            } else {
              if ( token != '' ) {
                SecureStore.setItemAsync( "notifications", String( allowed ) );
                that.setState( { notifications: allowed } );
              } else {
                that.setState( { notifications: false } );
                SecureStore.setItemAsync( "notifications", String( false ) );
              }
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          that.setState( { notifications: false } );
        }
      }
    });
  };

  wipe_session = async () => { // On Session Expiring Require Login
    try {
      clearInterval( this.session ); // Clear All Running Intervals
      clearInterval( this.validity );
      clearInterval( this.validity_controller_interval );
      clearInterval( this.new_messages );
      clearInterval( this.new_files );
      global.email_verified = null; // Set Verification Cache Empty
      global.education_valid = null;
      const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: "Home" } ) ] } ); // Return To Login Screen
      this.props.navigation.dispatch( resetAction );
    } catch ( exception ) {
      console.log( exception );
    }
  };

  wipe_validity = async () => { // On Validity Expiring, Wipe Cache So Net Call Is Run
    try {
      global.email_verified = null;
      global.education_valid = null;
    } catch ( exception ) {
      console.log( exception );
    }
  }

  get_notes = async () => { // Get Saved Notes From Database
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    const { navigate } = this.props.navigation;
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/notes/notes.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              that.setState( { notes: response[ "message" ] } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  delete_note = async ( note ) => { // Delete A Note From The Database
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "note_id", note[ "id" ] );
    const { navigate } = this.props.navigation;
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/notes/deleteNote.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              var index = that.state.notes.indexOf(note);
              var newArry = that.state.notes;
              if (index !== -1) newArry.splice(index, 1);
              that.setState( { notes: newArry } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  new_note = async () => { // Add A New Note With No Body To It
    var id = await SecureStore.getItemAsync( "session_id" );
    const { navigate } = this.props.navigation;
    prompt( "Enter Note Title", "", [ {text: "Cancel", style: "cancel"},
     { text: "OK", onPress: noteTitle => {
       const form_data = new FormData();
       form_data.append( "session_id", id );
       form_data.append( "note_title", noteTitle );
       var that = this;
       const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/notes/newNote.php";
       require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
         if ( timeout ) {
           Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
           return;
         } else {
           if ( ! err ) {
             if ( response != undefined ) {
               response = JSON.parse( response );
               if ( response[ "error" ] ) {
                 Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
               } else {
                 that.get_notes();
               }
             }
           } else {
             err = JSON.parse( err );
             Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
           }
         }
       });
     } },
    ], { cancelable: true } );
  };

  render () {
    const { navigate } = this.props.navigation;
    return (
      <View style={ styles.container } >
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline navigation={ this.props.navigation }/>
        <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
          <View style={ [ styles.row, { borderTopWidth: 0, borderBottomWidth: 0 } ] }>
            <Button main={ true } label={ "Add A New Note" } onPress={ () => this.new_note( this.state.notes ) } />
          </View>
          { ( this.state.notes.length == 0 ) ?
            <View style={ [ styles.row, { backgroundColor: "darkgray" } ] }>
                <Text style={ styles.noNote } >No Notes Found</Text>
            </View>
          : this.state.notes.map( note =>
            <View key={ note["id"] } style={ styles.row }>
              <Text style={ styles.rowText } >{ note[ "title" ] }{ "\n" }{ note["creation_date"] }</Text>
              <TouchableOpacity onPress={ () => this.delete_note( note ) } style={ styles.deleteTouch }>
                <Text style={ styles.rowDeleteText }>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => navigate( "Notes_Editor", { id: note["id"] } ) } style={ styles.openTouch }>
                <Text style={ styles.rowButton }>Open ></Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

export default Notes_Screen;
