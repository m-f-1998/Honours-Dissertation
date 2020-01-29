import React from 'react';
import { Text, View, StatusBar, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import prompt from 'react-native-prompt-android';

import CustomButton from "../../assets/button/component.js";
import OfflineNotice from "../../assets/no-connection/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Messages Threads
   Author: Matthew Frankland
   Description: A Component To Show Message Threads
  ==========================================
*/

class Messaging_Screen extends React.Component {
  static navigationOptions = {
    gestureEnabled: false,
    title: '',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#0B345A'
    }
  };

  state = {
    messageThreads: [],
    email: ""
  };

  componentDidMount() {
    this.get_message_threads();
  };

  imageError = () => {
    this.setState( { profile_pic_link: { uri: 'https://www.matthewfrankland.co.uk/images/error-profile.png' } } );
  };

  async get_message_threads() { // Get Saved Messages From Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    let email = JSON.parse( await SecureStore.getItemAsync( 'account' ) )[ 'email' ];
    this.setState( { email: email } );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/getThreads.php';
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          if ( response == undefined ) {
            Alert.alert( 'Request Failed', 'An Internet Connection Is Required', [ { text: 'OK' } ] );
          } else {
            response = JSON.parse( response );
            if ( response[ 'error' ] ) {
              Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
            } else {
              var dict = {}
              for ( var i in response[ 'message' ] ) {
                response[ 'message' ][ i ][ 'is_lecturer' ] = response[ 'message' ][ i ][ 'is_lecturer' ] == 0 ? 'Student' : 'Lecturer';
                if ( response[ 'message' ][ i ][ 'recipient_email' ] == email ) {
                  dict[ response[ 'message' ][ i ][ 'original_email' ] ] = response[ 'message' ][ i ];
                } else {
                  dict[ response[ 'message' ][ i ][ 'recipient_email' ] ] = response[ 'message' ][ i ];
                }
              }
              that.setState( { messageThreads: dict } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  async delete_message( thread ) { // Delete A Message From The Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    form_data.append( 'thread_id', thread[ "id" ] );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/deleteMessages.php';
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          response = JSON.parse( response );
          if ( response == undefined ) {
            Alert.alert( 'Request Failed', 'An Internet Connection Is Required', [ { text: 'OK' } ] );
          } else {
            if ( response[ 'error' ] ) {
              Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
            } else {
              that.get_message_threads();
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  async new_message() { // Add A New Message With No Body To It
    var id = await SecureStore.getItemAsync( 'session_id' );
    prompt( 'Enter Recipient Email', '', [ {text: 'Cancel', style: 'cancel'},
     { text: 'OK', onPress: emailRecipient => {
       const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
       if ( expression.test( emailRecipient.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
         if ( !emailRecipient.endsWith( ".ac.uk" ) ) { // Must Be Education Email
           Alert.alert( 'Recipients Email Address Must Be An Educational Address', '', [ { text: 'OK' } ] );
           return;
         }
       } else {
         Alert.alert( 'Please Enter A Valid Email Address For Recipient', '', [ { text: 'OK' } ] );
         return;
       }
       const form_data = new FormData();
       form_data.append( 'session_id', id );
       form_data.append( 'email_recipient', emailRecipient );
       var that = this;
       const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/newMessageThread.php';
       require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
         if ( timeout ) {
           Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
         } else {
           if ( ! err ) {
             if ( response == undefined ) {
               Alert.alert( 'Request Failed', 'An Internet Connection Is Required', [ { text: 'OK' } ] );
             } else {
               response = JSON.parse( response );
               if ( response[ 'error' ] ) {
                 Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
               } else {
                 that.get_message_threads();
               }
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
      <View style={ this.state.emailValid === true ? styles.container : styles.emailInvalid } >
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <OfflineNotice />
        { !global.email_verified ? // E-Mail Not Valid
          <View style={ { paddingTop: 10, justifyContent: 'center', alignItems: 'center'} }>
            <Text style={ { textAlign: 'center', color: 'white' } }>E-Mail Not Valid!</Text>
            <TouchableOpacity style={ [ styles.openTouch, { marginTop: 10 } ] }><Text style={ styles.rowButton }>Resent Validation E-Mail</Text></TouchableOpacity>
            <TouchableOpacity onPress={ () => this.update_validitity() } style={ [ styles.openTouch, { marginTop: 10 } ] }><Text style={ styles.rowButton }>Refresh</Text></TouchableOpacity>
          </View>
        :
        <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
          <View style={ [ styles.row, { borderTopWidth: 0 } ] }>
            <CustomButton label={ "New Message Thread" } onPress={ () => this.new_message( this.state.messages ) } />
          </View>
          { ( this.state.messageThreads == undefined || Object.keys(this.state.messageThreads).length == 0 ) ?
              <View style={ [ styles.row, { backgroundColor: 'darkgray' } ] }>
                  <Text style={ styles.noMessage } >No Messages Found</Text>
              </View>
            : <View>
            { Object.keys( this.state.messageThreads ).map( ( key ) => (
                this.state.messageThreads[ key ][ "privacy" ] == 1 ?
                  <View key={ this.state.messageThreads[ key ][ "id" ] } style={ styles.row }>
                    { this.state.messageThreads[ key ]['recipient_profile_pic' ] != null ?
                      <View>
                        <Image onError={ this.imageError } style={ styles.image } source={ { uri: this.state.messageThreads[ key ]['recipient_profile_pic' ] } } />
                      </View>
                    : undefined }
                    <Text style={ [ styles.rowText, this.state.messageThreads[ key ]['recipient_profile_pic' ] != null ? { textAlign: 'center' } : undefined ] } >{ this.state.messageThreads[ key ][ 'recipient_forename' ] } { this.state.messageThreads[ key ][ 'recipient_surname' ] }{ "\n" }{ this.state.messageThreads[ key ][ 'is_lecturer' ] }</Text>
                    <View style={ { width: '25%', alignItems: 'center', justifyContent: 'center'} }>
                      <TouchableOpacity onPress={ () => navigate( "Messaging_View", { id: this.state.messageThreads[ key ][ "id" ], email: this.state.email } ) } style={ styles.openTouch }><Text style={ styles.rowButton }>Open ></Text></TouchableOpacity>
                      <TouchableOpacity onPress={ () => this.delete_message( this.state.messageThreads[ key ] ) } style={ styles.deleteTouch }><Text style={ styles.rowDeleteText }>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                :
                  <View key={ this.state.messageThreads[ key ][ "id" ] } style={ styles.row }>
                    <Text style={ styles.rowText } >{ this.state.messageThreads[ key ][ 'recipient_email' ] }{ "\n" }{ this.state.messageThreads[ key ][ 'is_lecturer' ] }</Text>
                    <View style={ { width: '25%', alignItems: 'center', justifyContent: 'center'} }>
                      <TouchableOpacity onPress={ () => navigate( "Messaging_View", { id: this.state.messageThreads[ key ][ "id" ], email: this.state.email } ) } style={ styles.openTouch }><Text style={ styles.rowButton }>Open ></Text></TouchableOpacity>
                      <TouchableOpacity onPress={ () => this.delete_message( this.state.messageThreads[ key ] ) } style={ styles.deleteTouch }><Text style={ styles.rowDeleteText }>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          }
        </ScrollView>
      }
      </View>
    )
  }
}

export default Messaging_Screen;
