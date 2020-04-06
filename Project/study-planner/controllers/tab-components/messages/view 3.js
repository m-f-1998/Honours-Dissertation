import React from "react";
import { Text, View, StatusBar, Alert, ScrollView, TextInput, KeyboardAvoidingView } from "react-native";

import * as SecureStore from "expo-secure-store";

import Offline from "../../assets/no-connection/component.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: Messages Conversations
   Author: Matthew Frankland
   Description: A React.Component To Show All Messages In A Message Thread
  ==========================================
*/

class Messaging_Conversations extends React.Component {
  static navigationOptions = () => ({
    title: "",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  });

  state = {
    messages: []
  }

  componentDidMount() {
    this.get_message();
  };

  get_message = async () => { // Get Saved Messages From Database
    var session_id = await SecureStore.getItemAsync( "session_id" );
    let thread_id = this.props.navigation.state.params[ "thread" ][ "id" ];
    const form_data = new FormData();
    form_data.append( "session_id", session_id );
    form_data.append( "thread_id", thread_id );
    const { navigate } = this.props.navigation;
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/getMessages.php";
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
              that.setState( { messages: response["message"] } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  send_message = async ( email, text ) => { // Get Saved Messages From Database
    if (text != "") {
      var id = await SecureStore.getItemAsync( "session_id" );
      let thread_id = this.props.navigation.state.params[ "thread" ][ "id" ];
      const form_data = new FormData();
      form_data.append( "session_id", id );
      form_data.append( "message_text", text );
      form_data.append( "thread_id", thread_id );
      form_data.append( "email", email );
      const { navigate } = this.props.navigation;
      var that = this;
      const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/messages/sendMessages.php";
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
                that.textInput.clear();
                that.get_message();
              }
            }
          } else {
            err = JSON.parse( err );
            Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          }
        }
      });
    }
  };

  render () {
    let email = this.props.navigation.state.params.email;
    let recipient_email = ( email == this.props.navigation.state.params[ "thread" ][ "recipient_email" ] ? this.props.navigation.state.params[ "thread" ][ "original_email" ] : this.props.navigation.state.params[ "thread" ][ "recipient_email" ] );
    return (
      <View style={ Styles.container } >
        <Offline />
        <Text style={{textAlign: 'center', color:'white', marginBottom: 10}}>Messaging: { recipient_email }</Text>
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <View style={ { height: "73%" } } >
          <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column",justifyContent: "center",}} behavior="padding" enabled keyboardVerticalOffset={225}>
            <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
              { this.state.messages.map( ( message, index ) => {
                return (
                  email != message["to_email"] ?
                    <View key={ index } style={ [ Styles.messageRow, { backgroundColor: "green" } ] }>
                      <Text style={ Styles.leftAlign } >{ message[ "creation_date" ] } { message[ "creation_time" ] }</Text>
                      <Text style={ Styles.rightAlign } >{"\n"}{ message[ "message" ] }</Text>
                    </View>
                  :
                    <View key={ index } style={ [ Styles.messageRow, { backgroundColor: "blue" } ] }>
                      <Text style={ Styles.rightAlign } >{ message[ "creation_date" ] } { message[ "creation_time" ] }</Text>
                      <Text style={ Styles.leftAlign } >{"\n"}{ message[ "message" ] }</Text>
                    </View>
                );
              })}
            </ScrollView>
            <View key={ "input" } style={ [ Styles.row, { bottom: 0, borderTopWidth: 0, borderBottomWidth: 0 } ] }>
              <TextInput
                ref={ input => { this.textInput = input } }
                placeholderTextColor="#C7C7CD"
                value={ this.state.email }
                autoCorrect={ false }
                autoCapitalize = "none"
                placeholder="New Message"
                style={ Styles.textInput }
                onSubmitEditing={ text => this.send_message( recipient_email, text.nativeEvent.text ) }
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

export default Messaging_Conversations;
