import React from "react";
import { View, KeyboardAvoidingView, TextInput, StatusBar, Alert, ActivityIndicator } from "react-native";

import { NavigationActions, StackActions } from "react-navigation";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import * as Permissions from "expo-permissions";

import Button from "../../assets/button/component.js";
import Offline from "../../assets/no-connection/component.js";
import Parent from "./parent.js";
import Styles from "../styles.js";

/*
  ==========================================
   Title: Login Screen
   Author: Matthew Frankland
   Description: React.Component For Processing User Login Requests
  ==========================================
*/

class LoginScreen extends Parent {
  componentDidMount () {
    this.email_ref.current.focus();
    SecureStore.getItemAsync( "biometrics" ).then( bio => { // Offer Login By Biometrics If Enabled
      if ( bio == "true" ) {
        LocalAuthentication.authenticateAsync().then( result => {
          if ( result[ "success" ] && result[ "error" ] == null ) {
            const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: "Tab_Navigator" } ) ] } );
            this.props.navigation.dispatch( resetAction );
          }
        })
      }
    } );
  };

  handleRequest = ( url, form_data, func ) => {  // Async Function To Await Response From Login Server
    var that = this;
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" } ] );
        return;
      } else {
        if ( !err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] )
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss" } ] );
            func ( !response[ "error" ], response );
          } else {
            Alert.alert( "Request Failed", "No Internet Connection", [ { text: "Dismiss" } ] );
          }
        } else {
          Alert.alert( "Request Failed", JSON.parse( err )[ "message" ], [ { text: "Dismiss" } ] );
        }
      }
      that.setState( { processing: false } );
    } );
  };

  handleLogin = () => { // Create Form Data And Send Request
    const form_data = new FormData();
    form_data.append( "email", this.state.email );
    form_data.append( "password", this.state.pass );
    var that = this;
    this.handleRequest ( "https://www.matthewfrankland.co.uk/dissertation/login/login.php", form_data, function ( flag, response ) {
      if ( flag ) { // On Success Move To Logged In Tab Controllers
        global.email_verified = ( response[ "account" ][ 0 ][ "email_verified" ] == 1 ? true : false ); // Global Flags For If Email Is Verified
        global.education_valid = ( response[ "account" ][ 0 ][ "university_id" ] == 1 ? false : true );
        SecureStore.getItemAsync( "account" ).then( result => {
          if ( response[ "account" ][ 0 ][ "email" ] == result[ "email" ] ) { // If New User Is Logging In Wipe Privacy
            SecureStore.deleteItemAsync( "privacy" ).done();
            SecureStore.deleteItemAsync( "biometrics" ).done();
          }
        });
        SecureStore.setItemAsync( "account", JSON.stringify( response [ "account" ] [ 0 ] ) );
        SecureStore.setItemAsync( "session_id", response [ "code" ] );
        const { status } = Permissions.askAsync( Permissions.NOTIFICATIONS ).then( () => { // Check If Notifications Has Already Been Enabled
          if ( status !== "granted" ) {
            SecureStore.getItemAsync( "notifications" ).then( value => { // Check Current Notification Setting
              if ( value == "true" ) {
                SecureStore.setItemAsync( "notifications", String( true ));
              } else {
                SecureStore.setItemAsync( "notifications", String( false ));
              }
            });
          }
        });
        const successNav = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: "Tab_Navigator" } ) ] } );
        that.props.navigation.dispatch( successNav );
      }
    } );
  };

  handleForgotPass = () => {
    const form_data = new FormData();
    form_data.append( "email", this.state.email );
    var that = this;
    this.handleRequest ( "https://www.matthewfrankland.co.uk/dissertation/resetPass/emailReset.php", form_data, function ( flag, response ) {
      if ( response[ "error" ] == true ) {
        Alert.alert( "An Error Occured While Requesting Password Reset", "Try Again Later", [ { text: "Dismiss" } ] );
      } else {
        if ( flag ) { // If Success Reset Email Has Been Sent
          Alert.alert( "A Password Reset Has Been Sent To You", "Make Sure To Check Your Spam Box If This Is Missing", [ { text: "Dismiss" } ] );
        } else {
          Alert.alert( "A Password Reset Could Not Be Sent To You", "", [ { text: "Dismiss" } ] );
        }
      }
      that.setState( { processing: false } );
    } );
  };

  render () {
    return (
      <KeyboardAvoidingView style={ Styles.container } behavior="padding" keyboardVerticalOffset="-100">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        <View style={ Styles.form }>
          <TextInput
            placeholderTextColor="#C7C7CD"
            ref={ this.email_ref } value={ this.state.email } style={ Styles.textInput }
            onChangeText={ ( email ) => this.setState( { email } ) }
            placeholder={ "Email" } autoCorrect={ false }
            keyboardType="email-address" autoCapitalize = "none"
            onSubmitEditing={ this.handleEmailSubmitPress }
            onBlur={ this.selectEmailInput }
          />
          <TextInput
            placeholderTextColor="#C7C7CD"
            value={ this.state.pass } style={ Styles.textInput }
            onChangeText={ ( pass ) => this.setState( { pass } ) }
            placeholder={ "Password" } secureTextEntry={ true }
            returnKeyType="done" autoCapitalize = "none"
            onBlur={ this.selectPassInput }
          />
          <Button main={ true } label={ "Login" }
            onPress={ () => this.analyseText( this.handleLogin ) }
            disabled={ this.state.processing || !this.state.email || !this.state.pass }
          />
          <Button main={ true } label={ "Forgot Password" }
            onPress={ () => this.analyseText( this.handleForgotPass ) }
            disabled={ this.state.processing || !this.state.email }
          />
          <Button disabled={ this.state.processing } label={ "< Go Back" } onPress={ () => this.props.navigation.goBack() } />
          <ActivityIndicator style={ { paddingTop: 10 } } size="small" color="#6b41de" animating={ this.state.processing } />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
