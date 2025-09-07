import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import ChatScreen from './src/screens/ChatScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  if ((Text as any).defaultProps == null) {
    (Text as any).defaultProps = {};
  }
  if ((TextInput as any).defaultProps == null) {
    (TextInput as any).defaultProps = {};
  }
  (Text as any).defaultProps.allowFontScaling = false;
  (Text as any).defaultProps.maxFontSizeMultiplier = 1;
  (TextInput as any).defaultProps.allowFontScaling = false;
  (TextInput as any).defaultProps.maxFontSizeMultiplier = 1;
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
