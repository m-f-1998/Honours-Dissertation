import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import styles from "./styles.js";

/*
  ==========================================
   Title: Custom Button
   Author: Matthew Frankland
   Description: Custom Button For Major And Minor Purposes ( Distinguishable By this.props )
  ==========================================
*/

class Button extends React.Component {
  render() {
    const containerStyle = [
      this.props.notMain ? styles.nonMainContainer : styles.mainContainer,
      styles.container, this.props.disabled ? styles.containerDisabled : styles.containerEnabled
    ];
    const testStyle = [
      this.props.notMain ? styles.nonMainText : styles.mainText,
      styles.text
    ];
    return (
      <TouchableOpacity style={ containerStyle } onPress={ this.props.onPress } disabled={ this.props.disabled }>
        <Text style={ testStyle }>{ this.props.label }</Text>
      </TouchableOpacity>
    );
  }
}

export default Button;
