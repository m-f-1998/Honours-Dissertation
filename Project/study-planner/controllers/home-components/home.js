import React from 'react';
import { View, KeyboardAvoidingView, Image, StatusBar, Linking } from 'react-native';

import imageLogo from "../../assets/images/logo.png";
import Button from "../assets/button/component.js";
import OfflineNotice from "../assets/no-connection/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: Home Screen
   Author: Matthew Frankland
   Description: App Launch Screen
  ==========================================
*/

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false
  };

  goToTerms = () => {
    Linking.openURL( 'https://matthewfrankland.co.uk/terms.html' ); // Link To T & C Document
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={ styles.container } behavior="padding">
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
        <OfflineNotice />
        <Image source={ imageLogo } style={ styles.logo } />
        <View style={ styles.form }>
          <Button label={ "Log In" } onPress={ () => navigate( 'Login', { name: 'Login' } ) } />
          <Button label={ "Create An Account" } onPress={ () => navigate( 'Sign_Up', { name: 'Sign_Up' } ) } />
          <Button style={ styles.back } label={ "Terms & Conditions" } onPress={ this.goToTerms } />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default HomeScreen;
