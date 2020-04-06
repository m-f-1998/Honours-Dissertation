import React from 'react';
import { View, KeyboardAvoidingView, Image, StatusBar, Linking } from 'react-native';

import imageLogo from "../../assets/logo_1000x1000.png";
import Offline from "../assets/no-connection/component.js";
import Button from "../assets/button/component.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: Launch Screen
   Author: Matthew Frankland
   Description: React.Component To Enter Into From Launch Storyboard
  ==========================================
*/

class LaunchScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false
  };

  goToTerms = () => {
    Linking.openURL( 'https://matthewfrankland.co.uk/terms.html' ); // Link To T & C Document
  };

  render () {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={ Styles.container } behavior="padding">
        <StatusBar backgroundColor="#000" barStyle="light-content"/>
        <Offline />
        <Image source={ imageLogo } style={ Styles.logo } />
        <View style={ Styles.form }>
          <Button main={ true } label={ "Log In" } onPress={ () => navigate( 'Login', { name: 'Login' } ) } />
          <Button main={ true } label={ "Create An Account" } onPress={ () => navigate( 'Sign_Up', { name: 'Sign_Up' } ) } />
          <Button main={ true } label={ "Terms & Conditions" } onPress={ this.goToTerms } />
        </View>
      </KeyboardAvoidingView>
    );
  };
}

export default LaunchScreen;
