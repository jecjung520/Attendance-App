import React, { Component, useState } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Attendance from '../tabs/Attendance';
import Leave from '../tabs/Leave';
import ScanScreen from '../tabs/ScanScreen';
import Home from './Home';
import Teacher from './Teacher';

const Main = () => {
    const [selectedTab, setSelectedTab] = useState(0)
    return (
        <View style={{ flex: 1 }}>
            {selectedTab == 0 ?
                (<Teacher />)
                : selectedTab == 1 ?
                    (<Attendance />)
                    : (<ScanScreen/>)}
            <View style={styles.text}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setSelectedTab(0);
                }}>
                    <Image
                        source={selectedTab == 0 ? require('../images/home_color.png') : require('../images/home.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setSelectedTab(1);
                }}>
                    <Image
                        source={selectedTab == 1 ? require('../images/attend_color.png') : require('../images/attend.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setSelectedTab(2);
                }}>
                    <Image
                        source={selectedTab == 2 ? require('../images/leave_color.png') : require('../images/leave.png')}
                        style={{ width: 24, height: 30 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        elevation: 4,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    button: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
export default Main;
