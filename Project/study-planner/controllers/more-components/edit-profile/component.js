import React from 'react';
import { KeyboardAvoidingView, Switch, StatusBar, TextInput, Text, Keyboard, Alert, View, ActivityIndicator } from 'react-native';

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import CustomButton from "../../assets/button/component.js";
import OfflineNotice from "../../assets/no-connection/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Edit Profile
   Author: Matthew Frankland
   Description: Add Details To A User Profile: First And Last Name, Email And Link To A Profile Picture
  ==========================================
*/

class EditProfileScreen extends React.Component {
  static navigationOptions = {
    gestureEnabled: false,
    title: ''
  };

  state = {
    compatible: false, // Are Biometrics Compatible With The Device
    biometrics: false, // Are Biometrics Enabled And Scans Available
    processing: false, // Is The Device Processing
    forename: '',
    surname: '',
    email: '',
    link: '',
    link_changed: false, // Profile Pic Link Has Been Edited For On Save
    forename_changed: false, // Forename Has Been Edited For On Save
    surname_changed: false, // Surname Has Been Edited For On Save
    email_changed: false, // Email Has Been Edited For On Save
    is_mounted: false
  };

  componentDidMount() {
    this.checkDeviceForHardware();
    this.checkForBiometrics();
    this.setState( { is_mounted: true } );
    SecureStore.getItemAsync( 'biometrics' ).then( value => {
      if ( value == 'true' ) {
        this.setState( { is_mounted: true, biometrics: true, compatible: true } )
      }
    });
    this.setTextInput();
  };

  componentWillUnmount(){
    this.setState( { is_mounted: false } );
  };

  checkDeviceForHardware = async () => { // Check Device Has The Hardware For Biometrics
    let compatible = await LocalAuthentication.hasHardwareAsync();
    this.setState( { compatible } );
  };

  checkForBiometrics = async () => { // Check Device Has A Biometric Scan To Use
    let biometrics = await LocalAuthentication.isEnrolledAsync();
    this.setState( { biometrics } );
  };

  setBiometrics = async ( value ) => {
    SecureStore.setItemAsync( "biometrics", String( value ) );
  };

  setTextInput = async () => {
    let account = JSON.parse( await SecureStore.getItemAsync( 'account' ) );
    this.setState( { is_mounted: true, forename: account[ "forename" ], link: account[ "profile_pic_link" ], surname: account[ "surname" ], email: account[ "email" ] } );
  };

  updateProfile = async () => {
    var id = await SecureStore.getItemAsync( 'session_id' );
    var account = JSON.parse( await SecureStore.getItemAsync( 'account' ) );

    const form_data = new FormData();
    form_data.append( 'session_id', id );
    if ( this.state.forename_changed ) {
      form_data.append( 'forename', this.state.forename );
      account[ 'forename' ] = this.state.forename;
    }
    if ( this.state.surname_changed ) {
      form_data.append( 'surname', this.state.surname );
      account[ 'surname' ] = this.state.surname;
    }
    form_data.append( 'profile_pic_link', this.state.link );
    account[ 'profile_pic_link' ] = this.state.link;
    form_data.append( 'email', this.state.email );

    // Check A Valid Email Has Been Given If Provided //
    var emailValid = true;
    if ( this.state.email_changed ) {
      emailValid = false;
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if ( expression.test( this.state.email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
        if ( this.state.email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
          account[ 'email' ] = this.state.email;
          emailValid = true;
        } else {
          Alert.alert( 'Your Registered Email Must Be An Educational Address', '', [ { text: 'OK' } ] );
        }
      } else {
        Alert.alert( 'Please Enter A Valid Email', '', [ { text: 'OK' } ] );
      }
    }

    this.setState( { processing: true } );

    if ( emailValid ) {
      Keyboard.dismiss();
      const url = 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/updateProfile.php';
      var that = this;
      require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
        if ( timeout ) {
          Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
        } else {
          if ( ! err ) {
            response = JSON.parse( response );
            if ( response[ 'error' ] ) {
              Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
            } else {
              SecureStore.setItemAsync( "account", JSON.stringify ( account ) );
              that.setState( { email_changed: false, forename_changed: false, surname_changed: false } );
              Alert.alert( 'Profile Updated', '', [ { text: 'OK' } ] );
            }
          } else {
            err = JSON.parse( err );
            Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
          }
        }
        that.setState( { processing: false } );
      });
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={ styles.container } behavior="padding" keyboardVerticalOffset="145">
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
        <OfflineNotice />
        <View style={ styles.form }>
          <TextInput value={ this.state.forename } placeholder="Forename" style={ styles.textInput } onChangeText={ text => this.setState( { forename: text, forename_changed: true } ) } />
          <TextInput value={ this.state.surname } placeholder="Surname" style={ styles.textInput } onChangeText={ text => this.setState( { surname: text, surname_changed: true } ) } />
          <TextInput value={ this.state.email } autoCorrect={ false } autoCapitalize = 'none' keyboardType="email-address" placeholder="E-Mail" style={ styles.textInput } onChangeText={ text => this.setState( { email: text, email_changed: true } ) } />
          <TextInput value={ this.state.link } autoCorrect={ false } autoCapitalize = 'none' placeholder="Profile Picture Link" style={ styles.textInput } onChangeText={ text => this.setState( { link: text, link_changed: true } ) } />
          { this.state.compatible ?
              <View style={ styles.switch }>
                <Text style={ styles.text }>Turn On Biometrics:{"\n"}</Text>
                <Switch value={ this.state.compatible && this.state.biometrics } onValueChange={ v => { this.setBiometrics( v ); } } />
              </View>
            : undefined
          }
          <CustomButton disabled={ this.processing } label={ "Update" } onPress={ () => this.updateProfile() } />
          <ActivityIndicator style={ { paddingTop: 10 } } size="small" color="#0000ff" animating={ this.state.processing } />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default EditProfileScreen;
