import React from 'react';
import { Switch, StatusBar, Text, View, Alert } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import OfflineNotice from "../../assets/no-connection/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Privacy Control
   Author: Matthew Frankland
   Description: Options To Change Privacy Settings
  ==========================================
*/

class Privacy_Control_Screen extends React.Component {
  static navigationOptions = {
    gestureEnabled: false,
    title: '',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#0B345A'
    }
  };

  state = {
    notifications: false,
    details: false
  }

  componentDidMount() {
    SecureStore.getItemAsync( 'privacy' ).then( value => { // Check Current Privacy Setting
      if ( value == 'true' ) {
        this.setState( { details: true } )
      }
    });
    SecureStore.getItemAsync( 'notifications' ).then( value => { // Check Current Notification Setting
      if ( value == 'true' ) {
        this.setState( { notifications: true } )
      }
    });
  }

  setPrivacy = async ( value ) => { // Enable Allowing Name To Be Viewable
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    form_data.append( 'value', String( value ) );
    var that = this;
    const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/privacySet.php';
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
              SecureStore.setItemAsync( "privacy", String( value ) );
              that.setState( { details: value } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  }

  generateToken = async() => {
    var token = await SecureStore.getItemAsync( 'notifications-token' );
    if ( token == null ) {
      const { status } = await Permissions.askAsync( Permissions.NOTIFICATIONS );
      if ( status !== 'granted' ) {
        this.setState( { notifications: false } );
        alert( 'Sorry Notification Permissions Were Not Granted!' );
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
    }
    return token
  }

  setNotifications = async ( allowed ) => { // Add Permissions For Notifications
    var token = await this.generateToken();
    var id = await SecureStore.getItemAsync( 'session_id' );
    const form_data = new FormData();
    form_data.append( 'session_id', id );
    form_data.append( 'allowed', allowed );
    form_data.append( 'token', token );
    var that = this;
    require("../../assets/fetch.js").getFetch( "https://www.matthewfrankland.co.uk/dissertation/userFunctions/savePush.php", form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
        that.setState( { notifications: false } );
      } else {
        if ( ! err ) {
          if ( response == undefined ) {
            Alert.alert( 'Request Failed', 'An Internet Connection Is Required', [ { text: 'OK' } ] );
            that.setState( { notifications: false } );
          } else {
            response = JSON.parse( response );
            if ( response[ 'error' ] ) {
              Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
              that.setState( { notifications: false } );
            } else {
              that.setState( { notifications: allowed } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
          that.setState( { notifications: false } );
        }
      }
    });
  }

  render() {
    return (
      <View style={ styles.container } behavior="padding" keyboardVerticalOffset="175">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <OfflineNotice />
        <View style={ styles.switch }>
          <Text style={ styles.text }>Allow Notifications:{"\n"}</Text>
          <Switch value={ this.state.notifications } onValueChange={ v => { this.setNotifications( v ); } } />
        </View>
        <View style={ styles.switch }>
          <Text style={ styles.text }>Allow Other Users In A Shared Group To View Your Name And Profile Picture:{"\n"}</Text>
          <Switch value={ this.state.details } onValueChange={ v => { this.setPrivacy( v ); } } />
        </View>
        <View style={ styles.footerView }>
          <Text style={ styles.footerText }>
            Members Of Your Shared Groups Will Always Be Able To View Your Email Adress
          </Text>
        </View>
      </View>
    );
  }
}

export default Privacy_Control_Screen;
