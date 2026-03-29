import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FormScreen from './screens/FormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Match History' }} 
        />
        <Stack.Screen 
          name="Form" 
          component={FormScreen} 
          options={{ title: 'Match Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}