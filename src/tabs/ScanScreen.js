import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../Config';
import { authenticateAsync, hasHardwareAsync, isEnrolledAsync } from 'expo-local-authentication';
let emailId = '', userId = '';
let attendanceList = [];


const ScanScreen = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [course, setCourse] = useState('');
    const [checkInEnable, setCheckInEnable] = useState(true);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        biometricsAuth();
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
    
    const biometricsAuth = async () => {
      const compatible = await hasHardwareAsync()
      if (!compatible) throw 'This device is not compatible for biometric authentication'
      const enrolled = await isEnrolledAsync()
      if (!enrolled) throw 'This device doesnt have biometric authentication enabled'
      const result = await authenticateAsync()
      if (!result.success) throw `${result.error} - Authentication unsuccessful`
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
      // firebase.firestore()
      //   .collection('users')
      //   .doc(userId)
      //   .onSnapshot(documentSnapshot => {
      //     console.log('User data: ', documentSnapshot.data().attendance);
      //     if (documentSnapshot.data().attendance !== undefined) {
      //       documentSnapshot.data().attendance.map(item => {
      //         attendanceList.push(item);
      //       });
      //     }
      //   });
    };
    const saveCheckIn = async () => {
        await AsyncStorage.setItem('STATUS', 'CIN');
    };

    const uploadCheckIn = () => {
        let currentTime = (new Date().getHours() + ":" + new Date().getMinutes());
        attendanceList.push({ time: currentTime, course: course, date: currentDate });
        firebase.firestore()
          .collection('users')
          .doc(userId)
          .update({
            attendance: attendanceList
          })
          .then(() => {
            console.log('User updated!');
          });
        firebase.firestore()
          .collection('courses')
          .doc(course)
          .update({
            attendance: firebase.firestore.FieldValue.arrayUnion(userId)
          })
          .then(() => {
            console.log('User updated!');
          });
        attendanceList = [];
        // firebase.firestore()
        //   .collection('users')
        //   .doc(userId)
        //   .onSnapshot(documentSnapshot => {
        //     console.log('User data: ', documentSnapshot.data().attendance);
        //     if (documentSnapshot.data().attendance !== undefined) {
        //       documentSnapshot.data().attendance.map(item => {
        //         attendanceList.push(item);
        //       });
        //     }
        //   });
    };

    const handleBarCodeScanned = ({ type, data }) => {
      if (data.length > 6) {
        const hash = data.substring(7,10);
        data = data.substring(0,6);
        firebase.firestore().collection('course').doc(data).get()
        .then((doc) => {
          if (doc.exists) {
            const curHash = doc.data().hash;
            console.log("hash retrieved: " + curHash);
          } else {
            console.log("hash not found");
          }
        });
        // console.log(hash + " " + curHash);
      }
      
      // setScanned(true);
      // saveDate(); 
      // saveCheckIn();
      // setCourse(data);
      // uploadCheckIn();
      // alert(`Attendance taken for course ${data}`);
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