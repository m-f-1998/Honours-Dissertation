import React from "react";
import { KeyboardAvoidingView, Switch, StatusBar, TextInput, Text, Keyboard, Alert, View, ActivityIndicator } from "react-native";

import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

import Button from "../../assets/button/component.js";
import Offline from "../../assets/no-connection/component.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: Edit Profile
   Author: Matthew Frankland
   Description: React.Component To Add Details To A User Profile: First Name, Last Name, Email And Link To A Profile Picture
  ==========================================
*/

class EditProfileScreen extends React.Component {
  static navigationOptions = {
    title: "",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  };

  state = {
    // Data For TextInput Fields //
    forename: "",
    surname: "",
    email: "",
    link: "",
    // Flag For If TextInput Has Chnaged Since componentDidMount() //
    link_changed: false,
    forename_changed: false,
    surname_changed: false,
    email_changed: false,
    // Biometrics Flags //
    compatible: false, // Compatible With The Device
    biometrics: false, // Enabled And Scans Available
    // Settinsg Flags //
    processing: false,
    is_mounted: false
  };

  componentDidMount () {
    this.checkDeviceForHardware();
    this.checkForBiometrics();
    this.setState( { is_mounted: true } );
    SecureStore.getItemAsync( "biometrics" ).then( value => {
      if ( value == "true" ) {
        this.setState( { is_mounted: true, biometrics: true, compatible: true } )
      }
    });
    this.setTextInput();
  };

  componentWillUnmount () {
    this.setState( { is_mounted: false } );
  };

  checkDeviceForHardware = async () => { // Check Device Has The Hardware For Biometrics
    let compatible = await LocalAuthentication.hasHardwareAsync();
    this.setState( { compatible: compatible } );
  };

  checkForBiometrics = async () => { // Check Device Has A Biometric Scan To Use
    let biometrics = await LocalAuthentication.isEnrolledAsync();
    this.setState( { biometrics: biometrics } );
  };

  setBiometrics = async ( value ) => {
    if ( value ) {
      if ( this.state.biometrics && this.state.compatible ) {
        SecureStore.setItemAsync( "biometrics", String( value ) );
      } else {
        Alert.alert( "Biometrics Is Not Available On This Device", "", [ { text: "Dismiss" } ] );
      }
    } else {
      this.setState( { biometrics: false } );
      SecureStore.setItemAsync( "biometrics", String( value ) );
    }
  };

  setTextInput = async () => {
    let account = JSON.parse( await SecureStore.getItemAsync( "account" ) );
    this.setState(
      {
        is_mounted: true,
        forename: account[ "forename" ],
        link: account[ "profile_pic_link" ],
        surname: account[ "surname" ],
        email: account[ "email" ]
      }
    );
  };

  updateProfile = async () => {
    const { navigate } = this.props.navigation;

    var id = await SecureStore.getItemAsync( "session_id" );
    var account = JSON.parse( await SecureStore.getItemAsync( "account" ) );

    const form_data = new FormData();
    form_data.append( "session_id", id );

    if ( this.state.forename_changed ) {
      form_data.append( "forename", this.state.forename );
    }

    if ( this.state.surname_changed ) {
      form_data.append( "surname", this.state.surname );
    }

    if (this.state.link == null) {
      this.setState( { link: "" } );
    }

    form_data.append( "profile_pic_link", this.state.link );

    // Check A Valid Email Has Been Given If Provided //
    if ( this.state.email_changed ) {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      if ( expression.test( this.state.email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
        if ( this.state.email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
          form_data.append( "email", this.state.email );
          account[ "email" ] = this.state.email;
        } else {
          Alert.alert( "Your Registered Email Must Be An Educational Address", "", [ { text: "Dismiss" } ] );
          this.setState( { email_changed: false, forename_changed: false, surname_changed: false } );
          return;
        }
      } else {
        Alert.alert( "Please Enter A Valid Email", "", [ { text: "Dismiss" } ] );
        this.setState( { email_changed: false, forename_changed: false, surname_changed: false } );
        return;
      }
    }

    this.setState( { processing: true } );

    Keyboard.dismiss();
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/updateProfile.php";
    var that = this;
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
              account[ "forename" ] = that.state.forename;
              account[ "surname" ] = that.state.surname;
              account[ "profile_pic_link" ] = that.state.link;

              if (that.state.link == null) {
                this.setState( { link: "" } );
              }
              SecureStore.setItemAsync( "account", JSON.stringify ( account ) );
              that.setState( { email_changed: false, forename_changed: false, surname_changed: false } );
              Alert.alert( "Profile Updated", "", [ { text: "Dismiss" } ] );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
      that.setState( { processing: false } );
    } );
  };

  render() {
    return (
      <KeyboardAvoidingView style={ Styles.container } behavior="padding" keyboardVerticalOffset="145">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        <View style={ Styles.form }>
          <TextInput placeholderTextColor="#C7C7CD" value={ this.state.forename } placeholder="Forename" style={ Styles.textInput } onChangeText={ text => this.setState( { forename: text, forename_changed: true } ) } />
          <TextInput placeholderTextColor="#C7C7CD" value={ this.state.surname } placeholder="Surname" style={ Styles.textInput } onChangeText={ text => this.setState( { surname: text, surname_changed: true } ) } />
          <TextInput placeholderTextColor="#C7C7CD" value={ this.state.email } autoCorrect={ false } autoCapitalize = "none" keyboardType="email-address" placeholder="E-Mail" style={ Styles.textInput } onChangeText={ text => this.setState( { email: text, email_changed: true } ) } />
          <TextInput placeholderTextColor="#C7C7CD" value={ this.state.link } autoCorrect={ false } autoCapitalize = "none" placeholder="Profile Picture Link" style={ Styles.textInput } onChangeText={ text => this.setState( { link: text, link_changed: true } ) } />
          { this.state.compatible && this.state.biometrics ?
              <View style={ Styles.switch }>
                <Text style={ Styles.text }>Turn On Biometrics:{"\n"}</Text>
                <Switch value={ this.state.compatible && this.state.biometrics } onValueChange={ v => { this.setBiometrics( v ); } } />
              </View>
            : undefined
          }
          <Button disabled={ this.processing } main={ true } label={ "Update" } onPress={ () => this.updateProfile() } />
          <ActivityIndicator style={ { paddingTop: 10 } } size="small" color="#0000ff" animating={ this.state.processing } />
        </View>
      </KeyboardAvoidingView>
    );
  };
}

export default EditProfileScreen;
