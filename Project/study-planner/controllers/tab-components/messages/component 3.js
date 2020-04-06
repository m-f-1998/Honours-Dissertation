import React from "react";
import { Text, View, StatusBar, Alert, ScrollView, TouchableOpacity, Image } from "react-native";

import * as SecureStore from "expo-secure-store";
import prompt from "react-native-prompt-android";

import Button from "../../assets/button/component.js";
import Offline from "../../assets/no-connection/component.js";
import Validity_Controller from "../../tab-components/validity-controller.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: Messages Threads
   Author: Matthew Frankland
   Description: React.Componnet To Display Current Message Threads
  ==========================================
*/

class Messaging_Screen extends Validity_Controller {
  static navigationOptions = {
    title: "",
    headerShown: false
  };

  componentDidMount () {
    this.get_message_threads();
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.props.navigation.addListener('willBlur', this.onScreenUnfocus);
  };

  onScreenFocus = () => {
    this.new_messages = setInterval( ()=> this.get_message_threads(), 10000 ); // Retrieve New Messages
  };

	onScreenUnfocus = () => {
		clearInterval( this.new_messages );
	}

  imageError = () => {
    this.setState( { profile_pic_link: { uri: "https://www.matthewfrankland.co.uk/images/error-profile.png" } } );
  };

  get_message_threads = async () => { // Get Saved Messages From Database
    var id = await SecureStore.getItemAsync( "session_id" );
    let email = JSON.parse( await SecureStore.getItemAsync( "account" ) )[ "email" ];
    this.setState( { email: email } );
    const form_data = new FormData();
    const { navigate } = this.props.navigation;
    form_data.append( "session_id", id );
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/getThreads.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        clearInterval( that.new_messages );
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
              clearInterval( that.new_messages );
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              var dict = {};
              for ( var i in response[ "message" ] ) {
                for ( var j in response[ "message" ][ i ] ) {
                  response[ "message" ][ i ][ j ][ "is_lecturer" ] = response[ "message" ][ i ][ j ][ "is_lecturer" ] == 0 ? "Student" : "Lecturer";
                  if ( response[ "message" ][ i ][ j ][ "recipient_email" ] == email ) {
                    let original = response[ "message" ][ i ][ j ][ "originating_user" ];
                    let email = response[ "message" ][ i ][ j ][ "original_email" ];
                    let forename = response[ "message" ][ i ][ j ][ "original_forename" ];
                    let surname = response[ "message" ][ i ][ j ][ "original_surname" ];
                    let profile_pic = response[ "message" ][ i ][ j ][ "original_profile_pic" ];
                    response[ "message" ][ i ][ j ][ "original_profile_pic" ] = response[ "message" ][ i ][ j ][ "recipient_profile_pic" ];
                    response[ "message" ][ i ][ j ][ "original_surname" ] = response[ "message" ][ i ][ j ][ "recipient_surname" ];
                    response[ "message" ][ i ][ j ][ "original_forename" ] = response[ "message" ][ i ][ j ][ "recipient_forename" ];
                    response[ "message" ][ i ][ j ][ "original_email" ] = response[ "message" ][ i ][ j ][ "recipient_email" ];
                    response[ "message" ][ i ][ j ][ "originating_user" ] = response[ "message" ][ i ][ j ][ "recipient_user" ];
                    response[ "message" ][ i ][ j ][ "recipient_profile_pic" ] = profile_pic;
                    response[ "message" ][ i ][ j ][ "recipient_surname" ] = surname;
                    response[ "message" ][ i ][ j ][ "recipient_forename" ] = forename;
                    response[ "message" ][ i ][ j ][ "recipient_email" ] = email;
                    response[ "message" ][ i ][ j ][ "recipient_user" ] = original;
                    dict[ response[ "message" ][ i ][ j ][ "recipient_email" ] ] = response[ "message" ][ i ][ j ];
                  } else {
                    dict[ response[ "message" ][ i ][ j ][ "recipient_email" ] ] = response[ "message" ][ i ][ j ];
                  }
                }
              }
              that.setState( { messageThreads: dict } );
            }
          }
        } else {
          err = JSON.parse( err );
          clearInterval( that.new_messages );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  delete_message = async ( thread ) => { // Delete A Message From The Database
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "thread_id", thread[ "id" ] );
    const { navigate } = this.props.navigation;
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/deleteMessages.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        clearInterval( that.new_messages );
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        return;
      } else {
        if ( ! err ) {
          response = JSON.parse( response );
          if ( response != undefined ) {
            if ( response[ "error" ] ) {
              clearInterval( that.new_messages );
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              that.get_message_threads();
            }
          }
        } else {
          err = JSON.parse( err );
          clearInterval( that.new_messages );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  new_message = async () => { // Add A New Message With No Body To It
    var id = await SecureStore.getItemAsync( "session_id" );
    let email = JSON.parse( await SecureStore.getItemAsync( "account" ) )[ "email" ];
    const { navigate } = this.props.navigation;
    prompt( "Enter Recipient Email", "", [ {text: "Cancel", style: "cancel"},
     { text: "OK", onPress: emailRecipient => {
       const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
       if ( expression.test( emailRecipient.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
         if ( !emailRecipient.endsWith( ".ac.uk" ) ) { // Must Be Education Email
           clearInterval( that.new_messages );
           Alert.alert( "Recipients Email Address Must Be An Educational Address", "", [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) } ] );
           return;
         } else {
           if ( emailRecipient == email ) {
             clearInterval( that.new_messages );
             Alert.alert( "You Cannot Contact Yourself", "", [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) } ] );
             return;
           }
         }
       } else {
         clearInterval( that.new_messages );
         Alert.alert( "Please Enter A Valid Email Address For Recipient", "", [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) } ] );
         return;
       }
       const form_data = new FormData();
       form_data.append( "session_id", id );
       form_data.append( "email_recipient", emailRecipient );
       var that = this;
       const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/newMessageThread.php";
       require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
         if ( timeout ) {
           clearInterval( that.new_messages );
           Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
           return;
         } else {
           if ( ! err ) {
             if ( response != undefined ) {
               response = JSON.parse( response );
               if ( response[ "error" ] ) {
                 clearInterval( that.new_messages );
                 Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
               } else {
                 that.get_message_threads();
               }
             }
           } else {
             err = JSON.parse( err );
             clearInterval( that.new_messages );
             Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_messages = setInterval( ()=> that.get_message_threads(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          }
         }
       });
     } },
    ], { cancelable: true } );
  };

  render () {
    const { navigate } = this.props.navigation;
    return (
      <View style={ this.state.emailValid === true ? Styles.container : Styles.emailInvalid } >
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        { !global.email_verified ? // E-Mail Not Valid
          <View style={ { paddingTop: 10, justifyContent: "center", alignItems: "center"} }>
            <Text style={ { textAlign: "center", color: "white" } }>E-Mail Not Valid!</Text>
            <TouchableOpacity onPress={ this.verification_email } style={ [ Styles.openTouch, { marginTop: 10 } ] }>
              <Text style={ Styles.rowButton }>Resend Validation E-Mail</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ this.update_validitity } style={ [ Styles.openTouch, { marginTop: 10 } ] }>
              <Text style={ Styles.rowButton }>Refresh</Text>
            </TouchableOpacity>
          </View>
        :
        <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
          <View style={ [ Styles.row, { borderTopWidth: 0, borderBottomWidth: 2, borderBottomColor: 'white' } ] }>
            <Button main={ true } label={ "New Message Thread" } onPress={ () => this.new_message( this.state.messages ) } />
          </View>
          { ( this.state.messageThreads == undefined || Object.keys(this.state.messageThreads).length == 0 ) ?
              <View style={ [ Styles.row, { backgroundColor: "darkgray" } ] }>
                  <Text style={ Styles.noMessage } >No Messages Found</Text>
              </View>
            : <View>
            { Object.keys( this.state.messageThreads ).map( ( key ) => (
                this.state.messageThreads[ key ][ "privacy" ] == 1 ?
                  <View key={ this.state.messageThreads[ key ][ "id" ] } style={ Styles.row }>
                    { this.state.messageThreads[ key ]["recipient_profile_pic" ] != null && this.state.messageThreads[ key ]["recipient_profile_pic" ] != "" ?
                      <View>
                        <Image onError={ this.imageError } style={ Styles.image } source={ { uri: this.state.messageThreads[ key ]["recipient_profile_pic" ] } } />
                      </View>
                    : undefined }
                    <Text style={ [ Styles.rowText, this.state.messageThreads[ key ]["recipient_profile_pic" ] != null && this.state.messageThreads[ key ]["recipient_profile_pic" ] != '' ? { textAlign: "center" } : undefined ] } >
                      { this.state.messageThreads[ key ][ "recipient_forename" ] } { this.state.messageThreads[ key ][ "recipient_surname" ] }{ "\n" }{ this.state.messageThreads[ key ][ "is_lecturer" ] }
                    </Text>
                    <View style={ { width: "25%", alignItems: "center", justifyContent: "center"} }>
                      <TouchableOpacity onPress={ () => navigate( "Messaging_View", { thread: this.state.messageThreads[ key ], recipient_email: this.state.messageThreads[ key ][ "recipient_email" ], email: this.state.email } ) } style={ Styles.openTouch }>
                        <Text style={ Styles.rowButton }>Open ></Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={ () => this.delete_message( this.state.messageThreads[ key ] ) } style={ Styles.deleteTouch }>
                        <Text style={ Styles.rowDeleteText }>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                :
                  <View key={ this.state.messageThreads[ key ][ "id" ] } style={ Styles.row }>
                    <Text style={ Styles.rowText } >
                      { this.state.messageThreads[ key ][ "recipient_email" ] }{ "\n" }{ this.state.messageThreads[ key ][ "is_lecturer" ] }
                    </Text>
                    <View style={ { width: "25%", alignItems: "center", justifyContent: "center"} }>
                      <TouchableOpacity onPress={ () => navigate( "Messaging_View", { thread: this.state.messageThreads[ key ], recipient_email: this.state.messageThreads[ key ][ "recipient_email" ], email: this.state.email } ) } style={ Styles.openTouch }>
                        <Text style={ Styles.rowButton }>Open ></Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={ () => this.delete_message( this.state.messageThreads[ key ] ) } style={ Styles.deleteTouch }>
                        <Text style={ Styles.rowDeleteText }>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          }
        </ScrollView>
      }
      </View>
    )
  };
}

export default Messaging_Screen;
