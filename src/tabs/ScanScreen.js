import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../Config';
let emailId = '', userId = '';
let attendanceList = [];

const ScanScreen = ({navigation}) => {
    const [currentDate, setCurrentDate] = useState('');
    const [checkInEnable, setCheckInEnable] = useState(true);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
        setCurrentDate(curDate);
        saveDate();
        getSavedDates();
    }, []);

    const curDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();

    const saveDate = async () => {
      await AsyncStorage.setItem('Date', curDate);
    }
  
    const getSavedDates = async () => {
      const date = await AsyncStorage.getItem('DATE');
      const status = await AsyncStorage.getItem('STATUS');
      emailId = await AsyncStorage.getItem('EMAIL');
      userId = await AsyncStorage.getItem('USERID');
  
      if (date == curDate && status == 'CIN') {
        setCheckInEnable(false);
        setCheckOutEnable(true);
      } else if (date == curDate && status == 'COUT') {
        setCheckInEnable(false);
        setCheckOutEnable(false);
      }
      console.log(date);
      attendanceList = [];
      firebase.firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(documentSnapshot => {
          console.log('User data: ', documentSnapshot.data().attendance);
          if (documentSnapshot.data().attendance !== undefined) {
            documentSnapshot.data().attendance.map(item => {
              attendanceList.push(item);
            });
          }
        });
    };
    const saveCheckIn = async () => {
        await AsyncStorage.setItem('STATUS', 'CIN');
    };

    const uploadCheckIn = () => {
        let currentTime = (new Date().getHours() + ":" + new Date().getMinutes());
        attendanceList.push({ checkIn: currentTime, checkOut: '', date: currentDate });
        firebase.firestore()
          .collection('users')
          .doc(userId)
          .update({
            attendance: attendanceList
          })
          .then(() => {
            console.log('User updated!');
          });
        attendanceList = [];
        firebase.firestore()
          .collection('users')
          .doc(userId)
          .onSnapshot(documentSnapshot => {
            console.log('User data: ', documentSnapshot.data().attendance);
            if (documentSnapshot.data().attendance !== undefined) {
              documentSnapshot.data().attendance.map(item => {
                attendanceList.push(item);
              });
            }
          });
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        saveDate();
        saveCheckIn();
        uploadCheckIn();
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        allert(`Attendance taken for course ${type}`);
        navigation.goBack();
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
})

export default ScanScreen;