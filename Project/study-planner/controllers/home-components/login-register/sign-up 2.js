import React from "react";
import { View, KeyboardAvoidingView, TextInput, Text, StatusBar, Alert, ActivityIndicator } from "react-native";

import { CheckBox } from "react-native-elements"
import * as SecureStore from "expo-secure-store";
import * as Permissions from "expo-permissions";
import { NavigationActions, StackActions } from "react-navigation";

import Button from "../../assets/button/component.js";
import Offline from "../../assets/no-connection/component.js";
import ParentComponent from "./parent.js";
import Styles from "../styles.js";

/*
  ==========================================
   Title: Sign Up
   Author: Matthew Frankland
   Description: React.Component For Processing User-Registrations Requests To The Application
  ==========================================
*/

class RegisterScreen extends ParentComponent {
  componentDidMount () {
    this.email_ref.current.focus();
  };

  handleRequest = ( response ) => {
    if ( response[ "error" ] ) {
      Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss" } ] );
    } else {
      global.email_verified = false;
      global.education_valid = false;
      SecureStore.setItemAsync( "account", // No Details Provided As Only Just Signed Up
        JSON.stringify(
          {
            "dob": null,
            "email": this.state.email,
            "email_verified": 0,
            "forename": null,
            "is_admin": 0,
            "profile_pic_link": null,
            "surname": null,
            "university_id": 1
          }
        )
      );
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
      SecureStore.setItemAsync( "session_id", response[ "code" ] );
      const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: "Tab_Navigator" } ) ] } ); // Go To Logged In Home Page
      this.props.navigation.dispatch( resetAction );
      Alert.alert( "A Confirmation Email Has Been Sent To You", "Make Sure To Check Your Spam Box If This Is Missing", [ { text: "Dismiss" } ] );
    }
  };

  handleSignUp = () => {
    const form_data = new FormData();
    form_data.append( "email", this.state.email );
    form_data.append( "password", this.state.pass );
    const url = "https://www.matthewfrankland.co.uk/dissertation/login/register.php";
    var that = this;
    require("../../assets/fetch.js").getFetch( url, form_data , function ( _, response, timeout ) {
      if ( timeout ) {
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" } ] );
        return;
      } else {
        if ( response != undefined ) {
          that.handleRequest ( JSON.parse( response ) );
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
            onSubmitEditing={ this.handleEmailSubmitPress }
            placeholder={ "Email" } autoCorrect={ false }
            keyboardType="email-address" autoCapitalize = "none"
            onBlur={ this.selectEmailInput }
          />
          <Text style={ Styles.errorText }>{ ( !this.state.email && this.state.email_selected ? "Email is Required" : undefined ) || "" }</Text>
          <TextInput
            placeholderTextColor="#C7C7CD"
            value={ this.state.pass } style={ Styles.textInput }
            onChangeText={ ( pass ) => this.setState( { pass } ) }
            placeholder={ "Password" } secureTextEntry={ true }
            autoCapitalize = "none" returnKeyType="done"
            onBlur={ this.selectPassInput }
          />
          <Text style={ Styles.errorText }>{ ( !this.state.pass && this.state.pass_selected ? "Password is Required" : undefined ) || "" }</Text>
          <CheckBox
            title="I Consent To This Application Contacting Me By Email" checked={this.state.contact}
            textStyle={ { padding: 3, color: "white" } } containerStyle={ { backgroundColor: "#0B345A" } }
            onPress={ () => this.setState({contact: !this.state.contact } ) }
          />
          <CheckBox
            title="I Agree To The Terms & Conditions Of This Application" checked={this.state.terms}
            textStyle={ { padding: 3, color: "white" } } containerStyle={ { backgroundColor: "#0B345A" } }
            onPress={ () => this.setState( { terms: !this.state.terms } ) }
          />
          <Button main={ true } label={ "Create An Account" }
            onPress={ () => this.analyseText( this.handleSignUp ) }
            disabled={ this.state.processing || !this.state.contact || !this.state.terms || !this.state.email || !this.state.pass }
          />
          <Button disabled={ this.state.processing } label={ "< Go Back" } onPress={ () => this.props.navigation.goBack() } />
          <ActivityIndicator style={ { paddingTop: 30 } } size="small" color="#0000ff" animating={ this.state.processing } />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default RegisterScreen;
