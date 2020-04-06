import React from "react";
import { Text, View, StatusBar, KeyboardAvoidingView, Alert } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import { Agenda } from "react-native-calendars";
import { Notifications } from "expo";

import Validity_Controller from "../validity-controller.js";
import Offline from "../../assets/no-connection/component.js";
import Styles from "./styles.js";

const colorArray = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
		  "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
		  "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
		  "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
		  "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
		  "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
		  "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
		  "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
		  "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
		  "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"];
var colors = {};

class Shared_Calendar_Screen extends Validity_Controller {
  static navigationOptions = {
    tabBarLabel: "Calendar",
    tabBarIcon: ( { tintColor } ) => ( < Icon name="calendar" color={ tintColor } size={ 24 } /> )
  };

  componentDidMount () {
    this.get_classes();
		this.props.navigation.addListener('didFocus', this.onScreenFocus);
		this.props.navigation.addListener('willBlur', this.onScreenUnfocus);
  }

	onScreenFocus = () => {
		this.new_events = setInterval( ()=> this.get_classes(), 10000 ); // Retrieve New Events
	}

	onScreenUnfocus = () => {
		clearInterval( this.new_events );
	}

  get_classes = async () => { // Get Saved Notes From Database
    var id = await SecureStore.getItemAsync( "session_id" );
		const { navigate } = this.props.navigation;
    const form_data = new FormData();
    form_data.append( "session_id", id );
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/calendar/getClasses.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
				clearInterval( that.new_events );
				Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_events = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
				return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
							clearInterval( that.new_events );
              Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_events = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              for ( var i = 0; i < response["message"].length; i++ ) {
                  colors[response["message"][i]["class_code"]] = colorArray[i];
              }
              that.setState( { classes: response[ "message" ] } );
              that.get_events();
            }
          }
        } else {
          err = JSON.parse( err );
					clearInterval( that.new_events );
					Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_events = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    } );
  };

  get_events = async () => { // Get Saved Notes From Database
    var codes = [];
    for ( var i = 0; i < this.state.classes.length; i++ ) {
      codes.push( this.state.classes[ i ][ "class_code" ].replace( /&quot;/g, '\\"' ) );
    }
    var id = await SecureStore.getItemAsync( "session_id" );
		const { navigate } = this.props.navigation;
    const form_data = new FormData();
    form_data.append( "session_id", id );
    form_data.append( "class_code", JSON.stringify( codes ) );
    var that = this;
    const url = "https://www.matthewfrankland.co.uk/dissertation/userFunctions/calendar/getEvents.php";
    require("../../assets/fetch.js").getFetch( url, form_data, function ( err, response, timeout ) {
      if ( timeout ) {
				clearInterval( that.new_events );
				Alert.alert( "Request Timed Out", "A Stable Internet Connection Is Required", [ { text: "Dismiss", onPress: () => that.new_events = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
				return;
      } else {
        if ( ! err ) {
          if ( response != undefined ) {
            response = JSON.parse( response );
            if ( response[ "error" ] ) {
							clearInterval( that.new_events );
							Alert.alert( "An Error Occured", response[ "message" ], [ { text: "Dismiss", onPress: () => that.new_events = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
            } else {
              SecureStore.getItemAsync( "notifications" ).then( notifications => { // Offer Login By Biometrics If Enabled
                Notifications.cancelAllScheduledNotificationsAsync();
                var marked = that.state.items;
                for ( var i = 0; i < response[ "message" ].length; i++ ) {
									var dateString = response[ "message" ][ i ][ "date_due" ] + " " + response[ "message" ][ i ][ "time_due" ]
										, reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
										 , [, year, month, day, hours, minutes, seconds ] = reggie.exec( dateString )
										 , dateObject = new Date( year, month-1, day, hours, minutes, seconds);
                  if ( notifications ) {
                    const localNotification = {
                      title: "A Project Is Due Tommorow For " + response[ "message" ][ i ]['class_code'],
                      body: "Don't Forget To Submit!!",
                    };
										dateObject.setDate(dateObject.getDate() - 1);
										if ( dateObject > Date() ) {
	                    const schedulingOptions = {
	                      time: dateObject
	                    };
	                    Notifications.scheduleLocalNotificationAsync( localNotification, schedulingOptions );
										}
										dateObject.setDate(dateObject.getDate() + 1);
                  }
                  marked[ response[ "message" ][ i ][ "date_due" ] ] = [{
										name: response[ "message" ][ i ]['class_name'] + " (" + response[ "message" ][ i ]['class_code'] + ")"
														+ " \nAssignment Title: " + response[ "message" ][ i ]['title']
														+ "\nDue: " + response[ "message" ][ i ][ "date_due" ] + " " + response[ "message" ][ i ]['time_due'] + " 🤦",
										height: Math.max(50, Math.floor(Math.random() * 150))
									}];
                }
                that.setState( { marked : marked } );
                that.setState( { events: response[ "message" ] } );
              } )
            }
          }
        } else {
          err = JSON.parse( err );
					clearInterval( that.new_events );
          Alert.alert( "Request Failed", err[ "message" ], [ { text: "Dismiss", onPress: () => that.new_events = setInterval( ()=> that.get_classes(), 10000 ) }, { text: "Logout", onPress: () => ( clearInterval( that.session ), clearInterval( that.validity ), navigate( 'Home' ) ) } ] );
        }
      }
    } );
  };

	loadItems = ( day ) => {
		for ( let i = -185; i < 185; i++ ) {
			const time = day.timestamp + i * 24 * 60 * 60 * 1000;
			const strTime = this.timeToString( time );
			if ( !this.state.items[ strTime ] ) {
				this.state.items[ strTime ] = [];
			}
		}
		const newItems = {};
			Object.keys( this.state.items ).forEach( key => { newItems[ key ] = this.state.items[ key ]; } );
			this.setState( {
				items: newItems
			} );
	  }


	 renderItem = ( item ) => {
		 return (
			 <View style={ { position: 'absolute', bottom: 0 } } >
				 <Text style={ { position: 'absolute', bottom: 0 } }>{ item.name }</Text>
			 </View>
		 );
	 }

	 renderEmptyDate = () => {
		 return (
			 <View style={ { position: 'absolute', bottom: 0 } }>
				 <Text>There are no deadlines scheduled for today! 🥳</Text>
			 </View>
		 );
	 }

  timeToString = ( time ) => {
    const date = new Date( time );
    return date.toISOString().split( 'T' )[ 0 ];
  }

	rowHasChanged = ( r1, r2 ) => {
		return r1.name !== r2.name;
	}

	currentDate = () => {
		 var today = new Date();
		 var dd = String(today.getDate()).padStart(2, '0');
		 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		 var yyyy = today.getFullYear();
		 return yyyy + '-' + mm + '-' + dd;
	}

	minDate = () => {
		 var today = new Date();
		 today.setDate(today.getDate() - 185);
		 var dd = String(today.getDate()).padStart(2, '0');
		 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		 var yyyy = today.getFullYear();
		 return yyyy + '-' + mm + '-' + dd;
	}

	maxDate = () => {
		 var today = new Date();
		 today.setDate(today.getDate() + 184);
		 var dd = String(today.getDate()).padStart(2, '0');
		 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		 var yyyy = today.getFullYear();
		 return yyyy + '-' + mm + '-' + dd;
	}

  render () {
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
					<Agenda
						minDate={ this.minDate() }
					  maxDate={ this.maxDate() }
						items={ this.state.marked }
						loadItemsForMonth={ this.loadItems.bind( this ) }
						selected={ () => this.currentDate() }
						renderItem={ this.renderItem.bind( this ) }
						renderEmptyDate={ this.renderEmptyDate.bind( this ) }
						rowHasChanged={ this.rowHasChanged.bind( this ) }
						theme={ {
							monthTextColor: "white",
							calendarBackground: "#0B345A",
							dayTextColor: "white",
							textDisabledColor: "#747474",
							textMonthFontWeight: "bold",
							textDayFontWeight: "bold"
						} }
						style={ { marginTop: 50 } }
					/>
				}
      </KeyboardAvoidingView>
    )
  };
}

export default Shared_Calendar_Screen;
