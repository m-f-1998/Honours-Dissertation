import React from 'react';
import { Text, View, StatusBar, Alert, ScrollView, TextInput } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

import OfflineNotice from "../../assets/no-connection/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Messages Conversations
   Author: Matthew Frankland
   Description: A View To Show All Messages In A Message Threads
  ==========================================
*/

class Messaging_Conversations extends React.Component {
  static navigationOptions = () => ({
    gestureEnabled: false,
    title: '',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#0B345A'
    }
  });

  state = {
    messages: []
  }

  componentDidMount() {
    this.get_message();
  };

  async get_message() { // Get Saved Messages From Database
    var session_id = await SecureStore.getItemAsync( 'session_id' );
    let thread_id = this.props.navigation.state.params.id;
    const form_data = new FormData();
    form_data.append( 'session_id', session_id );
    form_data.append( 'thread_id', thread_id );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/getMessages.php';
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
              that.setState( { messages: response['message'] } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  async send_message( email, text ) { // Get Saved Messages From Database
    var id = await SecureStore.getItemAsync( 'session_id' );
    let thread_id = this.props.navigation.state.params.id;
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    form_data.append( 'message_text', text );
    form_data.append( 'thread_id', thread_id );
    form_data.append( 'email', email );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/sendMessages.php';
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
              that.get_message();
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  };

  render() {
    let email = this.props.navigation.state.params.email;
    return (
      <View style={ styles.container } >
        <OfflineNotice />
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
          { this.state.messages.map( ( message, index ) => {
            return (
              email == message['from_email'] ?
                <View key={ index } style={ [ styles.messageRow, { backgroundColor: 'green' } ] }>
                  <Text style={ styles.rightAlign } >{ message[ "creation_date" ] }{"\n"}{ message[ "creation_time" ] }</Text>
                  <Text style={ styles.leftAlign } >{"\n"}{ message[ "message" ] }</Text>
                </View>
                :
                  <View key={ index } style={ [ styles.messageRow, { backgroundColor: 'blue' } ] }>
                    <Text style={ styles.leftAlign } >{ message[ "creation_date" ] }{"\n"}{ message[ "creation_time" ] }</Text>
                    <Text style={ styles.rightAlign } >{"\n"}{ message[ "message" ] }</Text>
                  </View>
            );
          })}
          <View key={ "input" } style={ [ styles.row, { borderTopWidth: 0, borderBottomWidth: 0 } ] }>
            <TextInput placeholderTextColor="#C7C7CD" value={ this.state.email } returnKeyType='send' autoCorrect={ false } autoCapitalize = 'none' placeholder="New Message" style={ styles.textInput } onSubmitEditing={ text => this.send_message( email, text.nativeEvent.text ) } />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Messaging_Conversations;
