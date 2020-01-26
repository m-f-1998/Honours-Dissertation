import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from "react-native-vector-icons/FontAwesome";

import HomeScreen from "./controllers/home-components/home.js";
import LoginScreen from "./controllers/home-components/login-register/login.js";
import SignUpScreen from "./controllers/home-components/login-register/sign-up.js";

import File_Board_Screen from "./controllers/tab-components/file-boards.js";
import Shared_Calendar_Screen from "./controllers/tab-components/shared-calendar.js";
import Timetable_Screen from "./controllers/tab-components/timetable.js";


import Notes_Screen from "./controllers/tab-components/notes/component.js";
import Notes_Editor from "./controllers/tab-components/notes/view.js";

const Notes_Navigator = createStackNavigator( {
  Notes_Screen: { screen: Notes_Screen },
  Notes_Editor: { screen: Notes_Editor }
}, {
  navigationOptions: {
    title: '',
    gestureEnabled: false
  }
} );
Notes_Navigator.navigationOptions = {
  tabBarLabel: 'Notes',
  tabBarIcon: ( { tintColor } ) => ( < Icon name="book" color={ tintColor } size={ 20 } /> )
};

import More_Screen from "./controllers/tab-components/more/component.js";
import Edit_Profile_Screen from "./controllers/more-components/edit-profile/component.js";
import Messaging_Screen from "./controllers/more-components/messages/component.js";
import Privacy_Screen from "./controllers/more-components/privacy-control/component.js";

const More_Navigator = createStackNavigator( {
  More: { screen: More_Screen },
  Edit_Profile: { screen: Edit_Profile_Screen },
  Messaging: { screen: Messaging_Screen },
  Privacy: { screen: Privacy_Screen }
}, {
  navigationOptions: {
    title: '',
    gestureEnabled: false
  }
} );
More_Navigator.navigationOptions = {
  tabBarLabel: 'More',
  tabBarIcon: ( { tintColor } ) => ( < Icon name="cog" color={ tintColor } size={ 24 } /> )
};

const Tab_Navigator = createBottomTabNavigator({
  Notes_Navigator,
  Shared_Calendar_Screen,
  File_Board_Screen,
  Timetable_Screen,
  More_Navigator
}, {
    navigationOptions: { headerShown: false }
} );

const MainNavigator = createStackNavigator( {
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Sign_Up: { screen: SignUpScreen },
  Tab_Navigator: { screen: Tab_Navigator }
} );

const App = createAppContainer( MainNavigator );

export default App;
