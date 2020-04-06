import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from "react-native-vector-icons/FontAwesome";

import LaunchScreen from "./controllers/home-components/launch.js";
import LoginScreen from "./controllers/home-components/login-register/login.js";
import SignUpScreen from "./controllers/home-components/login-register/sign-up.js";

import File_Board_Screen from "./controllers/tab-components/file-boards/component.js";
import Shared_Calendar_Screen from "./controllers/tab-components/calendar/component.js";

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

import Messaging_Screen from "./controllers/tab-components/messages/component.js";
import Messaging_View from "./controllers/tab-components/messages/view.js";

const Messaging_Navigator = createStackNavigator( {
  Messaging: { screen: Messaging_Screen },
  Messaging_View: { screen: Messaging_View }
}, {
  navigationOptions: {
    title: ''
  }
} );
Messaging_Navigator.navigationOptions = {
  tabBarLabel: 'Messages',
  tabBarIcon: ( { tintColor } ) => ( < Icon name="envelope" color={ tintColor } size={ 24 } /> )
};

import More_Screen from "./controllers/tab-components/more/component.js";
import Edit_Profile_Screen from "./controllers/more-components/edit-profile/component.js";
import Privacy_Screen from "./controllers/more-components/privacy-control/component.js";

const More_Navigator = createStackNavigator( {
  More: { screen: More_Screen },
  Edit_Profile: { screen: Edit_Profile_Screen },
  Privacy: { screen: Privacy_Screen }
}, {
  navigationOptions: {
    title: ''
  }
} );
More_Navigator.navigationOptions = {
  tabBarLabel: 'More',
  tabBarIcon: ( { tintColor } ) => ( < Icon name="cog" color={ tintColor } size={ 24 } /> )
};

import Timetable_Screen from "./controllers/tab-components/file-boards/timetable/component.js";

const Timetable_Navigator = createStackNavigator( {
  Files: { screen: File_Board_Screen },
  Timetable: {
    screen: Timetable_Screen,
    navigationOptions: {
      title: '',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#0B345A'
      }
    },
  }
}, {
  navigationOptions: {
    title: '',
    gestureEnabled: false,
    tabBarLabel: 'Files',
    tabBarIcon: ( { tintColor } ) => ( < Icon name="files-o" color={ tintColor } size={ 24 } /> )
  }
} );

const Tab_Navigator = createBottomTabNavigator({
  Notes_Navigator,
  Shared_Calendar_Screen,
  Timetable_Navigator,
  Messaging_Navigator,
  More_Navigator
}, {
    navigationOptions: { headerShown: false }
} );

const MainNavigator = createStackNavigator( {
  Home: { screen: LaunchScreen },
  Login: { screen: LoginScreen },
  Sign_Up: { screen: SignUpScreen },
  Tab_Navigator: { screen: Tab_Navigator }
} );

const App = createAppContainer( MainNavigator );

export default App;
