import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect, useState } from 'react';
import { firebase } from '../../Config';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const Student = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    setCurrentDate(
      new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear(),
    );
    setCurrentTime(
      new Date().getHours() +
      ":" + 
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
    );
    saveDate();
    saveTime();
    // getSavedDates();
  }, []); 

  const curDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
  const curTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

  const saveDate = async () => {
    await AsyncStorage.setItem('Date', curDate);
  }

  const saveTime = async () => {
    await AsyncStorage.setItem('Time', curTime);
  }

    return (
      <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello</Text>
      </View>

      <Text style={styles.dateText}>
        {'Today Date: ' + currentDate + '   ' + currentTime }
      </Text>
      <View style={styles.buttons}>
        {/* present button */}
        <TouchableOpacity style = {styles.checkIn}>
          <Text style={{ color: 'white' }}>Present</Text>
        </TouchableOpacity>

        {/* absent button */}
        <TouchableOpacity style={styles.checkIn}>
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

export default Student;
