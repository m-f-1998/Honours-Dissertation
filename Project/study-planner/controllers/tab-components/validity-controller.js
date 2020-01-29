import React from 'react';
import { Alert } from 'react-native';

import * as SecureStore from 'expo-secure-store';

/*
  ==========================================
   Title: Validity Controller
   Author: Matthew Frankland
   Description: Parent Controller To Check Whether Email and Education Are Valid
  ==========================================
*/

class ValidityController extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#0B345A'
    }
  };

  componentDidMount() {
    this.validity_controller_interval = setInterval( ()=> this.update_validitity(), 1850000 ) // Shortly After Verification Cache Reset Run Update_Validity
  }

  componentWillUnmount() {
    clearInterval( this.validity_controller_interval ); // To Stop Mounting Of Interval When No Component Mounted
  }

  state = {
    emailValid: global.email_verified,
    educationValid: global.education_valid
  };

  update_validitity = () => {
    if ( global.email_verified == null ) {
      this.email_check();
    }
    if ( global.education_valid == null ) {
      this.education_check();
    }
  };

  email_check = async function () { // Check Whether Users Email Is Valid
    const formData = new FormData();
    var id = await SecureStore.getItemAsync( 'session_id' );
    formData.append( 'session_id', id );
    var that = this;
    return require("../assets/fetch.js").getFetch ( 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/emailValid.php', formData, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          if ( response == undefined ) {
            Alert.alert( 'Request Failed', 'An Internet Connection Is Required', [ { text: 'OK' } ] );
          } else {
            response = JSON.parse( response );
            if ( response[ 'error' ] ) {
              Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
            } else {
              that.setState( { emailValid: response[ 'message' ] } );
              global.email_verified = response[ 'message' ];
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    } );
  }

  education_check = async function () { // Check Whether Users Education Is Valid
    const formData = new FormData();
    var id = await SecureStore.getItemAsync( 'session_id' );
    formData.append( 'session_id', id );
    var that = this;
    return require("../assets/fetch.js").getFetch ( 'https://www.matthewfrankland.co.uk/dissertation/userFunctions/educationValid.php', formData, function ( err, response, timeout ) {
      if ( timeout ) {
        Alert.alert( 'Request Timed Out', 'A Stable Internet Connection Is Required', [ { text: 'OK' } ] );
      } else {
        if ( ! err ) {
          if ( response == undefined ) {
            Alert.alert( 'Request Failed', 'An Internet Connection Is Required', [ { text: 'OK' } ] );
          } else {
            response = JSON.parse( response );
            if ( response[ 'error' ] ) {
              Alert.alert( 'An Error Occured', response[ 'message' ], [ { text: 'OK' } ] );
            } else {
              that.setState( { educationValid: response[ 'message' ] } );
              global.education_valid = response[ 'message' ];
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( 'Request Failed', err[ 'message' ], [ { text: 'OK' } ] );
        }
      }
    } );
  }
}

export default ValidityController;
