import React from "react";
import { Switch, StatusBar, Text, View, Alert } from "react-native";

import * as SecureStore from "expo-secure-store";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

import Offline from "../../assets/no-connection/component.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: Privacy Control
   Author: Matthew Frankland
   Description: React.Component To Change Privacy Settings On User Account
  ==========================================
*/

class Privacy_Control_Screen extends React.Component {
  static navigationOptions = {
    title: "",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  };

  state = {
    notifications: false,
    details: false
  };

  componentDidMount () {
    SecureStore.getItemAsync( "privacy" ).then( value => { // Check Current Privacy Setting
      if ( value == "true" ) {
        this.setState( { details: true } )
      }
    });
    SecureStore.getItemAsync( "notifications" ).then( value => { // Check Current Notification Setting
      if ( value == "true" ) {
        this.setState( { notifications: true } )
      }
    });
  };

  setPrivacy = async ( value ) => { // Enable Allowing Name To Be Viewable
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "value", String( value ) );
    var that = this;
    const { navigate } = this.props.navigation;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/privacySet.php";
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
              SecureStore.setItemAsync( "privacy", String( value ) );
              that.setState( { details: value } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
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

  render () {
    return (
      <View style={ Styles.container } behavior="padding" keyboardVerticalOffset="175">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        <View style={ Styles.switch }>
          <Text style={ Styles.text }>Allow Notifications:{"\n"}</Text>
          <Switch value={ this.state.notifications } onValueChange={ v => { this.setNotifications( v ); } } />
        </View>
        <View style={ Styles.switch }>
          <Text style={ Styles.text }>Allow Other Users In A Shared Group To View Your Full Name And Profile Picture:{"\n"}</Text>
          <Switch value={ this.state.details } onValueChange={ v => { this.setPrivacy( v ); } } />
        </View>
        <View style={ Styles.footerView }>
          <Text style={ Styles.footerText }>
            Users You Communicate With (Including Lecturers) Will Always Be Able To View Your Email Adress{"\n"}{"\n"}
            System Administrators Are Always Be Able To View All Details Stored Against Your Profile.
          </Text>
        </View>
      </View>
    );
  };
}

export default Privacy_Control_Screen;
