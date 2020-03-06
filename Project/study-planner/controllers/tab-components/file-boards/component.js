import React from "react";
import { Alert, Text, View, StatusBar, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

import Validity_Controller from "../validity-controller.js";
import Offline from "../../assets/no-connection/component.js";
import Button from "../../assets/button/component.js";
import Styles from "./styles.js";

class File_Board_Screen extends Validity_Controller {
  static navigationOptions = {
    headerShown: false,
    title: "Files"
  };

  componentDidMount () {
    this.get_classes();
    this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.props.navigation.addListener('willBlur', this.onScreenUnfocus);
  }

  onScreenFocus = () => {
    this.new_files = setInterval( ()=> this.get_classes(), 10000 ); // Retrieve New Files
  }

  onScreenUnfocus = () => {
    clearInterval( this.new_files );
  }

  get_classes = async () => { // Get Saved Notes From Database
    if ( this.state.classes.length == 0 ) {
      var id = await SecureStore.getItemAsync( "session_id" );
      const form_data = new FormData();
      form_data.append( "session_id", id );
      const { navigate } = this.props.navigation;
      var that = this;
      const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/calendar/getClasses.php";
      require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
        if ( timeout ) {
          clearInterval( that.new_files );
          Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_files = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          return;
        } else {
          if ( ! err ) {
            if ( response != undefined ) {
              response = JSON.parse( response );
              if ( response[ "error" ] ) {
                clearInterval( that.new_files );
                Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_files = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
              } else {
                that.setState( { classes: response[ "message" ] } );
                that.get_docs();
              }
            }
          } else {
            err = JSON.parse( err );
            clearInterval( that.new_files );
            Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_files = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
          }
        }
      });
    } else {
      this.get_docs();
    }
  };

  get_docs = async () => { // Get Saved Notes From Database
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    const { navigate } = this.props.navigation;
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/fileBoards/getBoards.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
        clearInterval( that.new_files );
        Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_files = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
              clearInterval( that.new_files );
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_files = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              that.setState( { docs: response[ "message" ] } );
            }
          }
        } else {
          err = JSON.parse( err );
          clearInterval( that.new_files );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_files = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  render () {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={ Styles.container } behavior="padding">
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline />
        { !this.state.emailValid === true ? // E-Mail Not Valid
          <View style={ { marginTop: 10, justifyContent: "center", alignItems: "center" } }>
            <Text style={ { textAlign: "center", marginBottom: 5, color: "white" } }>Email Not Valid!</Text>
            <View style={ { marginBottom: 40 } }>
              <TouchableOpacity onPress={ () => this.verification_email() } style={ [ Styles.openTouch, { width: "50%" } ] }>
                <Text style={ Styles.rowButton }>Resend Validation E-Mail</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => this.update_validitity() } style={ [ Styles.openTouch, { width: "17%" } ] }>
                <Text style={ Styles.rowButton }>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        : !this.state.educationValid ? // Education Not Valid Not Valid
          <View>
            <Text style={ { textAlign: "center", marginBottom: 5, color: "white" } }>Education Not Valid!</Text>
            <View style={ { marginBottom: 40 } }>
              <TouchableOpacity onPress={ () => this.open_education_validitor() } style={ [ Styles.openTouch, { width: "50%" } ] }>
                <Text style={ Styles.rowButton }>Request An Education Code</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => this.update_validitity() } style={ [ Styles.openTouch, { width: "17%" } ] }>
                <Text style={ Styles.rowButton }>Refresh</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Enter Education Validity Code Here" placeholderTextColor="#C7C7CD"
              value={ this.state.educationValidityCode } style={ Styles.educationInput }
              onChangeText={ text => this.setState( { educationValidityCode: text } ) }
            />
            <TouchableOpacity onPress={ () => this.check_code_validity() } style={ [ Styles.openTouch, { width: "25%" } ] }>
              <Text style={ Styles.rowButton }>Submit Code</Text>
            </TouchableOpacity>
          </View>
        : ( this.state.emailValid && this.state.educationValid ) &&
          <ScrollView showsHorizontalScrollIndicator={ false } showsVerticalScrollIndicator={ false } bounces={ false } >
            <View style={ { width: "100%", alignSelf: "center"} } >
              <View style={ { margin: 10 } }>
                <Button main={ true } label={ "My Academic Timetable" } onPress={ () => navigate( "Timetable" ) } />
                <Text style={ { textAlign: "center", color: "white", fontWeight: "bold", fontStyle: "italic" } }>
                  Documents Will Be Made Available Here As Lecturer's Make Them Available
                </Text>
              </View>
              <View style={ { borderBottomWidth: 2, borderBottomColor: "white" } }>
                { ( this.state.classes.length == 0 ) ?
                  <View key="noClasses" style={ Styles.noClass }>
                    <Text style={ { textAlign: "center", color: "white", fontWeight: "bold" } }>You Are Not Registered To Any Classes</Text>
                  </View>
                  : this.state.classes.map( ( class_event, index ) =>
                    <View key={ index } style={ { marginTop: 10, padding: 10, borderTopWidth: 2, borderTopColor: "white" } }>
                      <Text style={ { color:"white", fontWeight: "bold" } } >{ class_event[ "class_name" ] }{"\n"}{ class_event[ "class_code" ] }</Text>
                      { ( this.state.docs.length == 0 ) ?
                        <Text style={ { color: "white", fontWeight: "bold", fontStyle: "italic" } }>{"\n"}No Documents Are Available For This Class</Text>
                        : this.state.docs.map( ( doc_event, index ) =>
                          <View key={ index } >
                            { ( doc_event[ "class_name" ] == class_event[ "class_name" ] ) ?
                                <Button label={ doc_event[ "title" ] } main={ true } onPress={ () => WebBrowser.openBrowserAsync( doc_event[ "link" ] ).then( () => {} ) } />
                            : undefined }
                          </View>
                      )}
                    </View>
                )}
              </View>
            </View>
          </ScrollView>
        }
      </KeyboardAvoidingView>
    )
  }
}

export default File_Board_Screen;
