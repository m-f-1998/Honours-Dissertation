import React from 'react';
import { View, KeyboardAvoidingView, TextInput, Text, StatusBar, Alert, ActivityIndicator } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Permissions from 'expo-permissions';

import Button from "../../assets/button/component.js";
import OfflineNotice from "../../assets/no-connection/component.js";
import ParentComponent from "./parent-component.js";
import styles from "../styles.js";

/*
  ==========================================
   Title: Login Screen
   Author: Matthew Frankland
   Description: Component For Users To Login To The Application
  ==========================================
*/

class LoginScreen extends ParentComponent {
  handleRequest ( url, form_data, func ) {  // Async Function To Await Response From Login Server
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( !err ) {
          response = JSON.parse( response );
          if ( response[ 'error' ] ) {
            Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
          }
          func ( !response[ 'error' ], response );
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    });
  }

  componentDidMount() {
    this.email_ref.current.focus();
    SecureStore.getItemAsync( 'biometrics' ).then( bio => { // Offer Login By Biometrics If Enabled
      if ( bio == "true" ) {
        LocalAuthentication.authenticateAsync().then( result => {
          if ( result[ "success" ] && result[ "error" ] == null ) {
            const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: 'Tab_Navigator' } ) ] } );
            this.props.navigation.dispatch( resetAction );
          }
        })
      }
    })
  }

  handleLogin = () => { // Create Form Data And Send Request
    const form_data = new FormData();
    form_data.append( 'email', this.state.email );
    form_data.append( 'password', this.state.pass );
    var that = this;
    this.handleRequest ( 'https://www.matthewfrankland.co.uk/dissertation/login/login.php', form_data, function ( flag, response ) {
      if ( flag ) { // On Success Move To Logged In Tab Controllers
        global.email_verified = ( response['account'][0]['email_verified'] == 1 ? true : false ); // Global Flags For If Email Is Verified
        global.education_valid = ( response['account'][0]['university_id'] == 1 ? false : true );
        SecureStore.getItemAsync( 'account' ).then( result => {
          if ( response[ 'account' ][ 0 ][ 'email' ] == result[ 'email' ] ) { // If New User Is Logging In Wipe Privacy
            SecureStore.deleteItemAsync( 'privacy' ).done();
            SecureStore.deleteItemAsync( 'biometrics' ).done();
          }
        });
        SecureStore.setItemAsync( "account", JSON.stringify( response [ 'account' ] [ 0 ] ) );
        SecureStore.setItemAsync( "session_id", response [ 'code' ] );
        const { status } = Permissions.askAsync(Permissions.NOTIFICATIONS).then( () => {
          if (status !== 'granted') {
            SecureStore.setItemAsync( "notifications", String( true ) );
          } else {
            SecureStore.setItemAsync( "notifications", String( false ) );
          }
        });
        const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: 'Tab_Navigator' } ) ] } );
        that.props.navigation.dispatch( resetAction );
      }
      that.setState( { processing: false } );
    });
  }

  handleForgotPass = () => {
    const form_data = new FormData();
    form_data.append( 'email', this.state.email );
    var that = this;
    this.handleRequest ( 'https://www.matthewfrankland.co.uk/dissertation/resetPass/emailReset.php', form_data, function ( flag, response ) {
      if ( response[ 'error' ] == true ) {
        Alert.alert( 'An Error Occured While Requesting Password Reset', 'Try Again Later', [ { text: 'OK' } ] );
      } else {
        if ( flag ) { // If Success Returned Email Has Been Sent
          Alert.alert( 'A Password Reset Has Been Sent To You', 'Make Sure To Check Your Spam Box If This Is Missing', [ { text: 'OK' } ] );
        } else {
          Alert.alert( 'A Password Reset Could Not Be Sent To You', '', [ { text: 'OK' } ] );
        }
      }
      that.setState( { processing: false } );
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={ styles.container } behavior="padding" keyboardVerticalOffset="-100">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <OfflineNotice />
        <View style={ styles.form }>
          <TextInput
            placeholderTextColor="#C7C7CD"
            ref={ this.email_ref }
            value={ this.state.email }
            onChangeText={ ( email ) => this.setState( { email } ) }
            onSubmitEditing={ this.handleEmailSubmitPress }
            style={ styles.textInput }
            placeholder={"Email"}
            autoCorrect={ false }
            autoCapitalize = 'none'
            keyboardType="email-address"
            onBlur={ this.selectEmailInput }
          />
          <Text
            style={ styles.errorText }>{ ( !this.state.email && this.state.email_selected ? "Email is Required" : undefined ) || "" }
          </Text>
          <TextInput
            placeholderTextColor="#C7C7CD"
            ref={ this.password_ref }
            value={ this.state.pass }
            style={ styles.textInput }
            onChangeText={ ( pass ) => this.setState( { pass } ) }
            placeholder={ "Password" }
            secureTextEntry={ true }
            returnKeyType="done"
            autoCapitalize = 'none'
            onBlur={ this.selectPassInput }
          />
          <Text style={ styles.errorText }>
            { ( !this.state.pass && this.state.pass_selected ? "Password is Required" : undefined ) || "" }
          </Text>
          <Button
            label={ "Login" }
            onPress={ () => this.analyseText( this.handleLogin ) }
            disabled={ this.state.processing || !this.state.email || !this.state.pass }
          />
          <Button
            label={ "Forgot Password" }
            onPress={ () => this.analyseText( this.handleForgotPass ) }
            disabled={ this.state.processing || !this.state.email }
          />
          <Button disabled={ this.state.processing } notMain={ true } label={ "< Go Back" } onPress={() => this.props.navigation.goBack()} />
          <ActivityIndicator style={ { paddingTop: 10 } } size="small" color="#6b41de" animating={ this.state.processing } />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
