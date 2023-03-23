import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../Config';
let emailId = '', userId = '';
let attendanceList = [];

const Home = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [checkInEnable, setCheckInEnable] = useState(true);
  const [checkOutEnable, setCheckOutEnable] = useState(false);

  useEffect(() => {
    setCurrentDate(
      new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear(),
    );
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

  const saveCheckOut = async () => {
    await AsyncStorage.setItem('STATUS', 'COUT');
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

  const uploadCheckOut = () => {
    let currentTime = (new Date().getHours() + ":" + new Date().getMinutes());
    attendanceList[attendanceList.length - 1].checkIn = attendanceList[attendanceList.length - 1].checkIn;
    attendanceList[attendanceList.length - 1].checkOut = currentTime;
    attendanceList[attendanceList.length - 1].date = currentDate;

    firebase.firestore()
      .collection('users')
      .doc(userId)
      .update({
        attendance: attendanceList
      })
      .then(() => {
        console.log('User updated!');
        attendanceList = [];
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>P2P Attendance</Text>
      </View>

      <Text style={styles.dateText}>
        {'Today Date: ' + currentDate}
      </Text>
      <View style={styles.buttons}>
        {/* present button */}
        <TouchableOpacity
          disabled={!checkInEnable}
          style={checkInEnable ? styles.checkIn : styles.checkOut}
          onPress={() => {
            saveDate();
            saveCheckIn();
            setCheckInEnable(false);
            setCheckOutEnable(true);
            uploadCheckIn();
          }}>
          <Text style={{ color: 'white' }}>Present</Text>
        </TouchableOpacity>

        {/* absent button */}
        <TouchableOpacity
          disabled={!checkOutEnable}
          style={checkOutEnable ? styles.checkIn : styles.checkOut}
          onPress={() => {
            saveCheckOut();
            setCheckInEnable(false);
            setCheckOutEnable(false);
            uploadCheckOut();
          }}>
          <Text style={{ color: 'white' }}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeiht: '800',
    alignSelf: 'center',
    marginTop: 100
  },
  checkIn: {
    width: '40%',
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 10
  },
  checkOut: {
    width: '40%',
    height: 50,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 10
  },
  header: {
    width: '100%',
    height: 60,
    elevation: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 20
  },
  headerText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginLeft: 20
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
})

export default Home;