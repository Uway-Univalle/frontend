
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InicioScreen from '../screens/InicioScreen';
import ConductorScreen from '../screens/ConductorScreen';
import PasajeroScreen from '../screens/PasajeroScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ setUserType }) {
  return (
    <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={InicioScreen} />
      <Stack.Screen name="Conductor" component={ConductorScreen} />
      <Stack.Screen name="Pasajero" component={PasajeroScreen} />
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setUserType={setUserType} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
