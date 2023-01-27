import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import Splash from './screens/Splash';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import { View, Text } from 'react-native';
import Main from './screens/Main';
import Main2 from './screens/Main2';
import Student from './screens/Student';
import Teacher from './screens/Teacher';

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
                <Stack.Screen
                    component={Main2}
                    name='Main2'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    component={Student}
                    name='Student'
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    component={Teacher}
                    name='Teacher'
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;