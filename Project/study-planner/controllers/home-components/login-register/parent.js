import React from "react";
import { Keyboard, Alert } from "react-native";

/*
  ==========================================
   Title: login-register/Parent Component
   Author: Matthew Frankland
   Description: Common Parent To Handle Common Functions Between Sign Up And Login
  ==========================================
*/

class ParentComponent extends React.Component {
  email_ref = React.createRef();

  static navigationOptions = {
    headerShown: false,
    gestureEnabled: false
  };

  state = {
    email: "",
    pass: "",
    processing: false
  };

  analyseText ( execute_input ) {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if ( expression.test( this.state.email.toLowerCase() ) ) { // Test E-Mail Is Valid On Lower Case For Realism
      if ( this.state.email.endsWith( ".ac.uk" ) ) { // Must Be Education Email
        Keyboard.dismiss();
        this.setState( { processing: true } );
        execute_input( this );
      } else {
        Alert.alert( "Your Registered Email Must Be An Educational Address", "", [ { text: "Dismiss" } ] );
      }
    } else {
      Alert.alert( "Please Enter A Valid Email", "", [ { text: "Dismiss" } ] );
    }
  };
}

export default ParentComponent;
