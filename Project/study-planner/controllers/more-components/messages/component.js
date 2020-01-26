import React from 'react';
import { Text, View, Button, StatusBar, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import prompt from 'react-native-prompt-android';

import CustomButton from "../../assets/button/component.js";
import Validity_Controller from "../../tab-components/validity-controller.js";
import OfflineNotice from "../../assets/no-connection/component.js";
import styles from "./styles.js";

class Messaging_Screen extends Validity_Controller {
  static navigationOptions = {
    gestureEnabled: false,
    title: '',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#0B345A'
    }
  };

  state = {
    messages: []
  };

  componentDidMount() {
    this.get_messages();
  };

  imageError = () => {
    this.setState( { profile_pic_link: { uri: 'https://www.matthewfrankland.co.uk/images/error-profile.png' } } );
  };

  async get_messages() { // Get Saved Messages From Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/messages.php';
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          response = JSON.parse( response );
          if ( response[ 'error' ] ) {
            Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
          } else {
            that.setState( { messages: response[ 'message' ] } );
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  async delete_message( message ) { // Delete A Message From The Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    form_data.append( 'message_id', message[ "id" ] );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/deleteMessages.php';
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          response = JSON.parse( response );
          if ( response[ 'error' ] ) {
            Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
          } else {
            var index = that.state.messages.indexOf(message);
            var newArry = that.state.messages;
            if (index !== -1) newArry.splice(index, 1);
            that.setState( { messages: newArry } );
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
         /*
         if ( !emailRecipient.endsWith( ".ac.uk" ) ) { // Must Be Education Email
           Alert.alert( 'Recipients Email Address Must Be An Educational Address', '', [ { text: 'OK' } ] );
           return;
         }*/
       } else {
         Alert.alert( 'Please Enter A Valid Email Address For Recipient', '', [ { text: 'OK' } ] );
         return;
       }
       const form_data = new FormData();
       form_data.append( 'session_id', id );
       form_data.append( 'email_recipient', emailRecipient );
       var that = this;
       const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/newMessages.php';
       require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
         if ( timeout ) {
           Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
         } else {
           if ( ! err ) {
             response = JSON.parse( response );
             if ( response[ 'error' ] ) {
               Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
             } else {
               that.get_messages();
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
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <OfflineNotice />
        <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
          <View style={ [ styles.row, { borderTopWidth: 0 } ] }>
            <CustomButton label={ "New Message" } onPress={ () => this.new_message( this.state.messages ) } />
          </View>
          { ( this.state.messages.length == 0 ) ?
            <View style={ [ styles.row, { backgroundColor: 'darkgray' } ] }>
                <Text style={ styles.noMessage } >No Messages Found</Text>
            </View>
          : this.state.messages.map( message =>
              message[ "to_privacy" ] == 1 ?
                <View key={ message[ "id" ] } style={ styles.row }>
                  { message['to_profile_pic' ] != null ?
                    <View>
                      <Image onError={ this.imageError } style={ styles.image } source={ { uri: message['to_profile_pic' ] } } />
                    </View>
                  : undefined }
                  <Text style={ [ styles.rowText, message['to_profile_pic' ] != null ? { textAlign: 'center', alignSelf: 'center' } : undefined ] } >{ message[ 'to_forename' ] } { message[ 'to_surname' ] }{ "\n" }{ message[ 'creation_date' ] }</Text>
                  <TouchableOpacity onPress={ () => this.delete_message( message ) } style={ styles.deleteTouch }><Text style={ styles.rowDeleteText }>Delete</Text></TouchableOpacity>
                  <TouchableOpacity onPress={ () => navigate( "", { id: message[ "id" ] } ) } style={ styles.openTouch }><Text style={ styles.rowButton }>Open ></Text></TouchableOpacity>
                </View>
              :
                <View key={ message[ "id" ] } style={ styles.row }>
                  <Text style={ styles.rowText } >{ message[ 'to_email' ] }{ "\n" }{ message[ 'creation_date' ] }</Text>
                  <TouchableOpacity onPress={ () => this.delete_message( message ) } style={ styles.deleteTouch }><Text style={ styles.rowDeleteText }>Delete</Text></TouchableOpacity>
                  <TouchableOpacity onPress={ () => navigate( "", { id: message[ "id" ] } ) } style={ styles.openTouch }><Text style={ styles.rowButton }>Open ></Text></TouchableOpacity>
                </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

export default Messaging_Screen;
