import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import Splash from './screens/Splash';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import { View, Text } from 'react-native';
import Main from './screens/Main';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    component={Splash}
                    name='Splash'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    component={Login}
                    name='Login'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    component={Signup}
                    name='Signup'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    component={Main}
                    name='Main'
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;