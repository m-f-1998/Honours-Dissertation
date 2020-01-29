import React from 'react';
import { Text, View } from 'react-native';

import NetInfo from '@react-native-community/netinfo';

import styles from "./styles.js";

/*
  ==========================================
   Title: No Connection Component
   Author: Matthew Frankland
   Description: Class To Display A Banner If No Connection Is Found
  ==========================================
*/

class NoConnection extends React.Component {
  state = {
    connected: true
  }

  componentDidMount() {
    this.internet_listener = NetInfo.addEventListener( state => { // Listen For Change In Internet And Store In State
      this.connectivityChanged( state.isConnected && state.isInternetReachable );
    });
  }

  componentWillUnmount() {
    this.internet_listener();
  }

  connectivityChanged = ( connected ) => {
    this.setState({ connected: connected }) // If Not Internet Show Rendered Error
  }

  render() {
    const containerStyle = [
      this.props.shortened ? styles.shortContainer : styles.container
    ];
    if ( !this.state.connected ) {
      return (
        <View style={ [ styles.container, containerStyle ] }>
          <Text style={ styles.text }>No Connection!</Text>
        </View>
      );
    }
    return null;
  }
}

export default NoConnection;
