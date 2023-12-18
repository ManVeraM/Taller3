import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Startup from './Startup';
import Home from './Home';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Startup">
      <Stack.Screen name="Startup" component={Startup} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};