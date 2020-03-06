import React from "react";
import { Text, TouchableOpacity } from "react-native";

import Styles from "./styles.js";

/*
  ==========================================
   Title: Custom Button
   Author: Matthew Frankland
   Description: Custom Button For Major And Minor Purposes ( Distinguishable By this.props )
  ==========================================
*/

class Button extends React.Component {
  render () {
    const containerStyle = [
      this.props.main ? { backgroundColor: "#6b41de" } : { backgroundColor: "white" },
      Styles.container, this.props.disabled ? { opacity: 0.3 } : { opacity: 1 }
    ];
    return (
      <TouchableOpacity style={ containerStyle } onPress={ this.props.onPress } disabled={ this.props.disabled }>
        <Text style={ [ this.props.main ? Styles.textColor : { color: "black" }, Styles.text ] }>{ this.props.label }</Text>
      </TouchableOpacity>
    );
  };
}

export default Button;
