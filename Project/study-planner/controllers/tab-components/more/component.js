import React from 'react';
import { View, Linking, StatusBar, Text, Image } from 'react-native';

import { NavigationActions, StackActions, NavigationEvents } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';

import Button from "../../assets/button/component.js";
import OfflineNotice from "../../assets/no-connection/component.js";
import styles from "./styles.js";

/*
  ==========================================
   Title: More Screen
   Author: Matthew Frankland
   Description: Messenger And Profile Settings
  ==========================================
*/

class More_Screen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
    title: 'More'
  };

  state = {
    surname: '',
    forename: '',
    email: '',
    email: '',
    profile_pic_link: { uri: 'https://www.matthewfrankland.co.uk/images/blank-profile.png' }
  };

  imageError = () => {
    this.setState( { profile_pic_link: { uri: 'https://www.matthewfrankland.co.uk/images/error-profile.png' } } );
  }

  refreshUser = () => {
    var that = this;
    SecureStore.getItemAsync( 'account' ).then ( ( value ) => {
      value = JSON.parse( value );
      if ( value[ 'surname' ] != null )
        that.setState( { surname: value[ 'surname' ] } ) ;
      if ( value[ 'forename' ] != null )
        that.setState( { forename: value[ 'forename' ] } ) ;
      if ( value[ 'email' ] != null )
        that.setState( { email: value[ 'email' ] } ) ;
      if ( value[ 'profile_pic_link' ] == '' ) {
        that.setState( { profile_pic_link: { uri: 'https://www.matthewfrankland.co.uk/images/blank-profile.png' } } ) ;
      } else {
        if ( value[ 'profile_pic_link' ] != null )
          that.setState( { profile_pic_link: { uri: value[ 'profile_pic_link' ] } } ) ;
      }
    });
  };

  goToTerms = () => {
    Linking.openURL( 'https://matthewfrankland.co.uk/terms.html' );
  };

  async signOut ( that ) {
    clearInterval( this.session ); // Clear All Running Intervals
    clearInterval( this.validity );
    clearInterval( this.validity_controller_interval );
    global.email_verified = null; // Set Verification Cache Empty
    global.education_valid = null;
    const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: 'Home' } ) ] } ); // Return To Login Screen
    that.props.navigation.dispatch( resetAction );
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={ styles.container }>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
        <OfflineNotice />
        <NavigationEvents onDidFocus={ () => this.refreshUser() } />
        <View style={ styles.buttonsOne }>
          <Image
            onError={ this.imageError }
            style={ styles.image }
            source={ this.state.profile_pic_link }
          />
          <Text style={ styles.accountName }>
            { this.state.forename } { this.state.surname }{"\n"}
            { this.state.email }{"\n"}
          Messenger and Profile Settings
          </Text>
          <Button label={ "Edit Profile" } onPress={ () => navigate( "Edit_Profile" ) } />
          <Button label={ "Privacy Controls" } onPress={ () => navigate( "Privacy" ) } />
          <Button label={ "Instant Messaging" } />
        </View>
        <View style={ styles.buttonsTwo }>
          <Button label={ "Terms & Conditions" } onPress={ this.goToTerms } />
          <Button label={ "Sign Out" } onPress={ () => this.signOut( this ) } />
        </View>
        <View style={ styles.footer }>
          <Text style={ styles.footerText }>
            Final Year Dissertation Project 2020{"\n"}Developed By Matthew Frankland
          </Text>
        </View>
      </View>
    );
  }
}

export default More_Screen;
