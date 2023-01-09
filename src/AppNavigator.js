import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

const stack = createStackNavigator();

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
                    component={Home}
                    name='Home'
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;