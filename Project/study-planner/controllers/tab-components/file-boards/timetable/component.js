import React from "react";
import { Text, View, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";

import { NavigationEvents } from "react-navigation";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

import Validity_Controller from "../../../tab-components/validity-controller.js";
import Offline from "../../../assets/no-connection/component.js";
import Styles from "./styles.js";

class Timetable_Screen extends Validity_Controller {
  static navigationOptions = {
    title: "",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  };

  componentDidMount() {
    this.retrieve_data();
    this.get_timetable();
  }

  retrieve_data = async () => {
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    const { navigate } = this.props.navigation;
    this.setState( { email: JSON.parse( await SecureStore.getItemAsync( "account" ) )[ "email" ] } );
    var that = this;
    require( "../../../assets/fetch.js" ).getFetch( "https://www.matthewfrankland.co.uk/dissertation/userFunctions/getUniData.php", form_data, function ( err, response, timeout ) {
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
            } else {
              that.setState( { serverName: response[ "message" ][ 1 ] } );
              that.setState( { uniName: response[ "message" ][ 0 ] } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          that.setState( { notifications: false } );
        }
      }
    });
  };

  get_timetable = async () => {
    // Construct Request Timetable Address From this.state.serverName
  }

  open_timetable = async () => {
    await WebBrowser.openBrowserAsync( "https://www.matthewfrankland.co.uk/dissertation/timetable/exemplar.pdf" );
    this.props.navigation.goBack();
  }

  render() {
    const valid = this.state.emailValid && this.state.educationValid;
    return (
      <KeyboardAvoidingView style={ [ Styles.container, valid ? undefined : { paddingTop: "15%" } ] } behavior="padding">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        { !this.state.emailValid === true ? // E-Mail Not Valid
          <View style={ { marginTop: 10, justifyContent: "center", alignItems: "center" } }>
            <Text style={ { textAlign: "center", marginBottom: 5, color: "white" } }>Email Not Valid!</Text>
            <View style={ { marginBottom: 40 } }>
              <TouchableOpacity onPress={ () => this.verification_email() } style={ [ Styles.openTouch, { marginBottom: 5, width: "50%" } ] }><Text style={ Styles.rowButton }>Resend Validation E-Mail</Text></TouchableOpacity>
              <TouchableOpacity onPress={ () => this.update_validitity() } style={ [ Styles.openTouch, { marginBottom: 5, width: "17%" } ] }><Text style={ Styles.rowButton }>Refresh</Text></TouchableOpacity>
            </View>
          </View>
        : !this.state.educationValid ? // Education Not Valid Not Valid
          <View>
            <Text style={ { textAlign: "center", marginBottom: 5, color: "white" } }>Education Not Valid!</Text>
            <View style={ { marginBottom: 40 } }>
              <TouchableOpacity onPress={ () => this.open_education_validitor() } style={ [ Styles.openTouch, { marginBottom: 5, width: "50%" } ] }><Text style={ Styles.rowButton }>Request An Education Code</Text></TouchableOpacity>
              <TouchableOpacity onPress={ () => this.update_validitity() } style={ [ Styles.openTouch, { marginBottom: 5, width: "17%" } ] }><Text style={ Styles.rowButton }>Refresh</Text></TouchableOpacity>
            </View>
            <TextInput placeholderTextColor="#C7C7CD" value={ this.state.educationValidityCode } placeholder="Enter Education Validity Code Here" style={ { width: "70%", alignSelf: "center", padding: 10, marginBottom: 10, textAlign: "center", borderColor: "#BEBEBE", borderBottomWidth: 0.4, color: "#FFF" } } onChangeText={ text => this.setState( { educationValidityCode: text } ) } />
            <TouchableOpacity onPress={ () => this.check_code_validity() } style={ [ Styles.openTouch, { marginBottom: 5, width: "25%" } ] }><Text style={ Styles.rowButton }>Submit Code</Text></TouchableOpacity>
          </View>
        : ( valid ) &&
          <View>
            <ActivityIndicator size="small" color="#FFF" animating={ this.state.processing } />
            <NavigationEvents onDidFocus={ () => this.open_timetable() } />
          </View>
        }
      </KeyboardAvoidingView>
    )
  }
}

export default Timetable_Screen;
