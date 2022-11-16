import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './firebase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import xxx from './screens/xxx';
import CreateGroupScreen from './screens/CreategroupScreen';
import AddUserScreen from './screens/AddUserScreen';
import CreateEvent from './screens/CreateEvent';
import ListFriendScreen from './screens/ListFriendScreen';
import GroupsScreen from './screens/GroupsScreen';
import EventsScreen from './screens/EventsScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: true }}
          name='Less loneless'
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: true }}
          name='Register Screen'
          component={RegisterScreen}
        />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='groupScreen' component={CreateGroupScreen} />
        <Stack.Screen name='Add Friend Screen' component={AddUserScreen} />
        <Stack.Screen name='Create Event Screen' component={CreateEvent} />
        <Stack.Screen name='My Friend' component={ListFriendScreen} />
        <Stack.Screen name='Groups' component={GroupsScreen} />
        <Stack.Screen name='Events' component={EventsScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
