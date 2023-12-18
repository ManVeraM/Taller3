import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Startup from './Startup';
import Home from './Home';

const Stack = createStackNavigator();

export const AppNavigator = ({ token }) => {
  return (
    <Stack.Navigator initialRouteName={token ? 'Home' : 'Login'}>
      <Stack.Screen name="Login" component={Startup} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};