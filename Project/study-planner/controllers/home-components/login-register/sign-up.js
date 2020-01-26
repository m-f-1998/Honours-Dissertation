import React from 'react';
import { View, KeyboardAvoidingView, TextInput, Text, StatusBar, Alert, ActivityIndicator } from 'react-native';

import { CheckBox } from 'react-native-elements'
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';

import Button from "../../assets/button/component.js";
import OfflineNotice from "../../assets/no-connection/component.js";
import ParentComponent from "./parent-component.js";
import styles from "../styles.js";
import { NavigationActions, StackActions } from 'react-navigation';

/*
  ==========================================
   Title: Sign Up
   Author: Matthew Frankland
   Description: Register On The Application
  ==========================================
*/

class SignUpScreen extends ParentComponent {
  componentDidMount() {
    this.email_ref.current.focus();
  }

  handleRequest = ( response ) => {
    if ( response[ 'error' ] ) {
      Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
    } else {
      global.email_verified = false;
      global.education_valid = false;
      SecureStore.setItemAsync( "account", // No Details Provided As Only Just Signed Up
        JSON.stringify( { "dob": null, "email": this.state.email, "email_verified": 0, "forename": null, "is_admin": 0, "profile_pic_link": null, "surname": null, "university_id": 1, } )
      );
      const { status } = Permissions.askAsync(Permissions.NOTIFICATIONS).then( () => { // Check If Notifications Has Already Been Enabled
        if (status !== 'granted') {
          SecureStore.setItemAsync( "notifications", String( true ) );
        } else {
          SecureStore.setItemAsync( "notifications", String( false ) );
        }
      });
      SecureStore.setItemAsync( "session_id", response[ 'code' ] );
      const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: 'Tab_Navigator' } ) ] } ); // Go To Logged In Home Page
      this.props.navigation.dispatch( resetAction );
      Alert.alert( 'A Confirmation Email Has Been Sent To You', 'Make Sure To Check Your Spam Box If This Is Missing', [ { text: 'OK' } ] );
    }
  }

  handleSignUp = () => {
    const form_data = new FormData();
    form_data.append( 'email', this.state.email );
    form_data.append( 'password', this.state.pass );
    const url = 'https://www.matthewfrankland.co.uk/dissertation/login/register.php';
    var that = this;
    require("../../assets/fetch.js").getFetch( url, form_data , function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( response != undefined ) {
          response = JSON.parse( response );
          that.handleRequest ( response );
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
      that.setState( { processing: false } );
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset="-100">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <OfflineNotice />
        <View style={ styles.form }>
          <TextInput
              placeholderTextColor="#C7C7CD"
              value={ this.state.email }
              ref={ this.email_ref }
              onChangeText={ ( email ) => this.setState( { email } ) }
              onSubmitEditing={ this.handleEmailSubmitPress }
              style={ styles.textInput }
              placeholder={ "Email" }
              autoCorrect={ false }
              autoCapitalize = 'none'
              keyboardType="email-address"
              onBlur={ this.selectEmailInput }
          />
          <Text style={ styles.errorText }>{ ( !this.state.email && this.state.email_selected ? "Email is Required" : undefined ) || "" }</Text>
          <TextInput
            placeholderTextColor="#C7C7CD"
            ref={ this.password_ref }
            value={ this.state.pass }
            style={ styles.textInput }
            onChangeText={ ( pass ) => this.setState( { pass } ) }
            placeholder={ "Password" }
            secureTextEntry={ true }
            autoCapitalize = 'none'
            returnKeyType="done"
            onBlur={ this.selectPassInput }
          />
          <Text style={ styles.errorText }>{ ( !this.state.pass && this.state.pass_selected ? "Password is Required" : undefined ) || "" }</Text>
          <CheckBox
            textStyle={ { padding: 3, color: 'white' } }
            containerStyle={ { backgroundColor: '#0B345A' } }
            title='I Consent To This Application Contacting Me By Email'
            checked={this.state.contact}
            onPress={ () => this.setState({contact: !this.state.contact } ) }
          />
          <CheckBox
            textStyle={ { padding: 3, color: 'white' } }
            containerStyle={ { backgroundColor: '#0B345A' } }
            title='I Agree To The Terms & Conditions Of This Application'
            checked={this.state.terms}
            onPress={ () => this.setState( { terms: !this.state.terms } ) }
          />
          <Button
            label={ "Create An Account" }
            onPress={ () => this.analyseText( this.handleSignUp ) }
            disabled={ this.state.processing || !this.state.contact || !this.state.terms || !this.state.email || !this.state.pass }
          />
          <Button disabled={ this.state.processing } notMain={ true } label={ "< Go Back" } onPress={ () => this.props.navigation.goBack() } />
          <ActivityIndicator style={ { paddingTop: 30 } } size="small" color="#0000ff" animating={ this.state.processing } />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default SignUpScreen;
