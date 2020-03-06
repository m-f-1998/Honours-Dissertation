import React from "react";
import { Alert } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

/*
  ==========================================
   Title: Validity Controller
   Author: Matthew Frankland
   Description: React.Component To Check Whether Email and Education Are Valid
  ==========================================
*/

class ValidityController extends React.Component {
  static navigationOptions = {
    title: "",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  };

  state = {
    emailValid: global.email_verified,
    educationValid: global.education_valid,
    messageThreads: [], classes: [], docs: [], events: [], items: {},
    email: "",
    educationValidityCode: "",
    processing: true
  };

  componentDidMount () {
    this.validity_controller_interval = setInterval( ()=> this.update_validitity(), 1850000 ); // Shortly After Verification Cache Reset Run Update_Validity
  };

  componentWillUnmount () {
    clearInterval( this.validity_controller_interval ); // To Stop Mounting Of Interval When No Component Mounted
  };

  update_validitity = () => {
    this.email_check();
    this.education_check();
  };

  open_education_validitor = async () => {
    await WebBrowser.openBrowserAsync( "https://www.matthewfrankland.co.uk/dissertation/educationLogin/home.html" );
  };

  check_code_validity = async () => { // Check Valid University
    if ( this.state.educationValidityCode != "" ) {
      const formData = new FormData();
      var id = await SecureStore.getItemAsync( "session_id" );
      var account = JSON.parse( await SecureStore.getItemAsync( "account" ) );
      formData.append( "session_id", id );
      formData.append( "code", this.state.educationValidityCode );
      const { navigate } = this.props.navigation;
      var that = this;
      return require("../assets/fetch.js").getFetch( "https://www.matthewfrankland.co.uk/dissertation/userFunctions/authenticateEducation.php", formData, function ( err, response, timeout ) {
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
                /*

                THIS IS WHERE UNDER NORMAL CIRCUMSTANCES A STUDENT WOULD BE REGISTERED TO THE CLASSES PASSED BACK FROM THE UNIVERSITY

                 */
                account[ "university_id" ] = response[ "message" ];
                SecureStore.setItemAsync( "account", JSON.stringify( account ) );
                that.setState( { educationValid: true } );
                global.education_valid = true;
              }
            }
          } else {
            err = JSON.parse( err );
            Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          }
        }
      } );
    } else {
      Alert.alert( "Request Failed", "Authentication Code Cannot Be Empty", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
    }
  };

  email_check = async () => { // Check Whether Users Email Is Valid
    const formData = new FormData();
    var id = await SecureStore.getItemAsync( "session_id" );
    formData.append( "session_id", id );
    const { navigate } = this.props.navigation;
    var that = this;
    return require("../assets/fetch.js").getFetch( "https://www.matthewfrankland.co.uk/dissertation/userFunctions/emailValid.php", formData, function ( err, response, timeout ) {
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
              that.setState( { emailValid: response[ "message" ] } );
              global.email_verified = response[ "message" ];
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    } );
  };

  verification_email = async () => { // Check Whether Users Email Is Valid
    const formData = new FormData();
    var account = JSON.parse( await SecureStore.getItemAsync( "account" ) );
    formData.append( "email", account["email"] );
    const { navigate } = this.props.navigation;
    return require("../assets/fetch.js").getFetch( "https://www.matthewfrankland.co.uk/dissertation/login/verificationEmail.php", formData, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            alert( response[ "message" ] );
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    } );
  };

  education_check = async () => { // Check Whether Users Education Is Valid
    const formData = new FormData();
    var id = await SecureStore.getItemAsync( "session_id" );
    formData.append( "session_id", id );
    const { navigate } = this.props.navigation;
    var that = this;
    return require("../assets/fetch.js").getFetch( "https://www.matthewfrankland.co.uk/dissertation/userFunctions/educationValid.php", formData, function ( err, response, timeout ) {
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
              that.setState( { educationValid: response[ "message" ] } );
              global.education_valid = response[ "message" ];
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    } );
  };
}

export default ValidityController;
