import React, { Component, useState } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Leave from '../tabs/Leave';
import Schedule from '../tabs/Schedule';
import ScanScreen from '../tabs/ScanScreen';
import Student from './Student';
import Home from './Home';
import Attendance from '../tabs/Attendance';

const Main2 = () => {
    const [selTab, setTab] = useState(0)
    return (
        <View style={{ flex: 1 }}>
            {selTab == 0 ?
                (<Student />)
                : selTab == 1 ?
                    (<Schedule />)
                    : (<Leave/>)}
            <View style={styles.text}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setTab(0);
                }}>
                    <Image
                        source={selTab == 0 ? require('../images/home_color.png') : require('../images/home.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setTab(1);
                }}>
                    <Image
                        source={selTab == 1 ? require('../images/attend_color.png') : require('../images/attend.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setTab(2);
                }}>
                    <Image
                        source={selTab == 2 ? require('../images/leave_color.png') : require('../images/leave.png')}
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
export default Main2;
