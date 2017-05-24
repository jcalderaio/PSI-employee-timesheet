import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Import the screens
import Login from '../screens/Login';
import Main from '../screens/Main';
import AddEntry from '../screens/AddEntry';
import SelectRecent from '../screens/SelectRecent';
import TodaysCharges from '../screens/TodaysCharges';

export const Tabs = TabNavigator({
  Main: {
    screen: Main,
    navigationOptions: {
      tabBarLabel: 'Main',
      tabBarIcon: ({ tintColor }) => <MaterialIcons name='account-circle' size={26} style={{ color: tintColor }} />
    },
  },
  TodaysCharges: {
    screen: TodaysCharges,
    navigationOptions: {
      tabBarLabel: 'Today\'s Charges',  // Label below tab
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-time' size={26} style={{ color: tintColor }} />
    },
  },
}, {
    headerMode: 'none',
    tabBarOptions: {
      activeTintColor: 'red'
    },
});

export const ModalStack = StackNavigator({
  Tabs: {
    screen: Tabs
  },
  AddEntry: {
		screen: AddEntry
	},
  SelectRecent: {
    screen: SelectRecent
  }
}, {
    mode: 'modal',
	headerMode: 'none' // So no navigation bar pops up
});

export const LoginStack = StackNavigator({ // This contains both the Tabs
  Login: {
    screen: Login
  },
  ModalStack: {
    screen: ModalStack
  }
}, {
  headerMode: 'none'
});
