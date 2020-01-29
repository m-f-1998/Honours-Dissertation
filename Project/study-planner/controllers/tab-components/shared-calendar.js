import React from 'react';
import { Text, View, Button, StatusBar, Alert } from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome";

import Validity_Controller from "./validity-controller.js";
import OfflineNotice from "../assets/no-connection/component.js";

class Shared_Calendar_Screen extends Validity_Controller {
  static navigationOptions = {
    tabBarLabel: 'Calendar',
    tabBarIcon: ( { tintColor } ) => ( < Icon name="calendar" color={ tintColor } size={ 24 } /> )
  };

  render() {
    return (
      <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
        <StatusBar backgroundColor="#FFFFFF" barStyle="light-content"/>
        <OfflineNotice />
        { !this.state.emailValid === true ? // E-Mail Not Valid
          <View style={ { marginTop: 10, justifyContent: 'center', alignItems: 'center' } }>
            <Text style={ { textAlign: 'center' } }>E-Mail Not Valid!</Text>
            <Button title="Resend Validation E-Mail" onPress={ () => Alert.alert('Simple Button pressed')} />
            <Button title="Refresh" onPress={ () => this.update_validitity() } />
          </View>
        : !this.state.educationValid ? // Education Not Valid Not Valid
          <View>
            <Text style={ { textAlign: 'center' } }>Education Not Valid!</Text>
            <Button title="Login To Education" onPress={ () => Alert.alert( 'Simple Button pressed' ) } />
            <Button title="Refresh" onPress={ () => this.update_validitity() } />
          </View>
        : ( this.state.emailValid && this.state.educationValid ) &&
          <View>
            <Text>Shared Calendar!</Text>
          </View>
        }
      </View>
    )
  }
}

export default Shared_Calendar_Screen;
