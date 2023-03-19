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
  const [hash, setHash] = useState('');

  const gethash = async () => {
    const hashRef = firebase.firestore().collection('courses').doc('EE4221');
    const doc = await hashRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data().hash);
      setHash(doc.data().hash);
    }
  };

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
  };

  const handleBarCodeScanned = ({ type, data }) => {
    gethash();
    if (data.length == 10) {
      data = data.substring(0, 6);
      const cur = data.substring(7, 10);
      console.log(hash + " " + cur);
      if (cur == hash) {
        saveDate();
        saveCheckIn();
        setCourse(data);
        uploadCheckIn();
        alert(`Attendance taken for course ${data}`);
      } else {
        alert('Wrong QR Code');

      }
    } else {
      alert('Wrong QR Code');

    }
    setScanned(true);
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