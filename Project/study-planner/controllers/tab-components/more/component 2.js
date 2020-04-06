import React from "react";
import { View, Linking, StatusBar, Text, Image, Alert } from "react-native";

import { NavigationActions, StackActions, NavigationEvents } from "react-navigation";
import * as SecureStore from "expo-secure-store";

import Button from "../../assets/button/component.js";
import Offline from "../../assets/no-connection/component.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: More Screen
   Author: Matthew Frankland
   Description: React.Component For Editing A Users Profile Settings
  ==========================================
*/

class More_Screen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
    title: "More",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  };

  state = {
    surname: "",
    forename: "",
    email: "",
    email: "",
    profile_pic_link: { uri: "https://www.matthewfrankland.co.uk/images/blank-profile.png" }
  };

  imageError = () => {
    this.setState( { profile_pic_link: { uri: "https://www.matthewfrankland.co.uk/images/error-profile.png" } } );
  }

  refreshUser = () => {
    var that = this;
    SecureStore.getItemAsync( "account" ).then ( ( value ) => {
      value = JSON.parse( value );
      if ( value[ "surname" ] != null )
        that.setState( { surname: value[ "surname" ] } ) ;
      if ( value[ "forename" ] != null )
        that.setState( { forename: value[ "forename" ] } ) ;
      if ( value[ "email" ] != null )
        that.setState( { email: value[ "email" ] } ) ;
      if ( value[ "profile_pic_link" ] == "" ) {
        that.setState( { profile_pic_link: { uri: "https://www.matthewfrankland.co.uk/images/blank-profile.png" } } ) ;
      } else {
        if ( value[ "profile_pic_link" ] != null )
          that.setState( { profile_pic_link: { uri: value[ "profile_pic_link" ] } } ) ;
      }
    });
  };

  goToTerms = () => {
    Linking.openURL( "https://matthewfrankland.co.uk/terms.html" );
  };

  signOut = async ( that ) => {
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "token", "" );
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
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          that.setState( { notifications: false } );
        }
      }
    });
    clearInterval( this.session ); // Clear All Running Intervals
    clearInterval( this.validity );
    clearInterval( this.new_messages );
    clearInterval( this.validity_controller_interval );
    clearInterval( this.new_messages );
    clearInterval( this.new_files );
    global.email_verified = null; // Set Verification Cache Empty
    global.education_valid = null;
    const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: "Home" } ) ] } ); // Return To Login Screen
    that.props.navigation.dispatch( resetAction );
  };

  render () {
    const { navigate } = this.props.navigation;
    return (
      <View style={ Styles.container }>
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        <NavigationEvents onDidFocus={ () => this.refreshUser() } />
        <View style={ Styles.buttonsOne }>
          <Image
            onError={ this.imageError }
            style={ Styles.image }
            source={ this.state.profile_pic_link }
          />
          <Text style={ Styles.accountName }>
            { this.state.forename } { this.state.surname }{"\n"}
            { this.state.email }{"\n"}Messenger and Profile Settings
          </Text>
          <Button main={ true } label={ "Edit Profile" } onPress={ () => navigate( "Edit_Profile" ) } />
          <Button main={ true } label={ "Privacy Controls" } onPress={ () => navigate( "Privacy" ) } />
        </View>
        <View style={ Styles.buttonsTwo }>
          <Button main={ true } label={ "Terms & Conditions" } onPress={ this.goToTerms } />
          <Button main={ true } label={ "Sign Out" } onPress={ () => this.signOut( this ) } />
        </View>
        <View style={ Styles.footer }>
          <Text style={ Styles.footerText }>
            Final Year Dissertation Project 2020{"\n"}Developed By Matthew Frankland
          </Text>
        </View>
      </View>
    );
  };
}

export default More_Screen;
