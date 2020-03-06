import React from "react";
import { View, StatusBar, Alert, SafeAreaView, Button, ScrollView, KeyboardAvoidingView } from "react-native";

import { actions, RichEditor, RichToolbar } from "../../../react-native-pell-rich-editor/index.js";
import * as SecureStore from "expo-secure-store";

import Offline from "../../assets/no-connection/component.js";
import Styles from "./styles.js";

/*
  ==========================================
   Title: Notes View
   Author: Matthew Frankland
   Description: A Rich Text Editor For Editing Notes
  ==========================================
*/

class Notes_Editor_Screen extends React.Component {
  static navigationOptions = ( { navigation } ) => ({
    gestureEnabled: false,
    title: "",
    headerTintColor: "white",
    headerLeft: () => (
      <Button onPress={ () => ( navigation.getParam( "runSave" )(), navigation.goBack() ) } title="< Notes" color="#fff" style={ { fontWeight: "bold" } } />
    ),
    headerStyle: {
      backgroundColor: "#0B345A"
    }
  });

  state = {
    noteText: "",
    isMounted: false
  };

  componentDidMount () {
    this.setState( { isMounted: true } )
    const { navigation } = this.props
    navigation.setParams( { runSave: () => this.save( false ) } )
    this.get_note();
  };

  componentWillUnmount (){
      this.state.isMounted = false
  };

  get_note = async function () {
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "note_id", this.props.navigation.state.params[ "id" ] );
    var that = this;
    const { navigate } = this.props.navigation;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/notes/getNote.php";
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
              that.setState( { isMounted: true, noteText: response[ "message" ] } );
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  save = async ( alert ) => {
    let html = await this.richText.getContentHtml();
    var id = await SecureStore.getItemAsync( "session_id" );
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "note_id", this.props.navigation.state.params[ "id" ] );
    form_data.append( "note_text", html );
    const { navigate } = this.props.navigation;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/notes/saveNote.php";
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
              if ( response[ "message" ] && alert ) {
                Alert.alert( "Note Saved", "", [ { text: "Dismiss" } ] );
              }
            }
          }
        } else {
          err = JSON.parse( err );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss" }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    });
  };

  render () {
    return (
      <SafeAreaView style={ Styles.editorContainer }>
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <Offline short={ true }/>
        <View style={ Styles.nav }>
          <Button title="Save" color="white" onPress={ () => this.save( true ) }/>
        </View>
        <ScrollView style={ Styles.scroll }>
          <RichEditor ref={ rf => this.richText = rf } initialContentHTML={ this.state.noteText } style={ Styles.rich } />
        </ScrollView>
        <KeyboardAvoidingView behavior={ "padding" } keyboardVerticalOffset="140" enabled>
          <RichToolbar actions={ [ actions.setBold, actions.setItalic, actions.insertBulletsList, actions.insertOrderedList  ] } style={ Styles.richBar } getEditor={ () => this.richText } iconTint={ "#000033" } selectedIconTint={ "#2095F2" } selectedButtonStyle={ { backgroundColor: "transparent" } }/>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
}

export default Notes_Editor_Screen;
