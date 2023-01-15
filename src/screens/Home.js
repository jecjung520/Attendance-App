import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Home() {
const Home = ({ navigation }) => {
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

  const saveDate = async() => {
    await AsyncStorage.setItem('Date', curDate);
  }

  const getSavedDates=async()=>{
    const date = await AsyncStorage.getItem('DATE');
    const status = await AsyncStorage.getItem('STATUS');
    
    if (date == curDate && status == 'CIN') {
      setCheckInEnable(false);
      setCheckOutEnable(true);
    } else if (date == curDate && status == 'COUT') {
      setCheckInEnable(false);
      setCheckOutEnable(false);
    }
    console.log(date);
  };

  const saveCheckIn = async() => {
    await AsyncStorage.setItem('STATUS', 'CIN');
  }

  const saveCheckOut = async() => {
    await AsyncStorage.setItem('STATUS', 'COUT');
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.text}>{currentDate}</Text>
{/* present button */}
    <TouchableOpacity 
      disabled={!checkInEnable}
      style={checkInEnable ? styles.checkIn : styles.checkOut}
      onPress={()=> {
        saveDate();
        saveCheckIn();
        setCheckInEnable(false);
        setCheckOutEnable(true);
      }}>
      <Text style={{color:'white'}}>Present</Text>
    </TouchableOpacity>

{/* absent button */}
    <TouchableOpacity 
      disabled={!checkOutEnable}
      style={checkOutEnable ? styles.checkIn : styles.checkOut}
      onPress={()=> {
        saveCheckOut();
        setCheckInEnable(false);
        setCheckOutEnable(false);
      }}>
      <Text style={{color:'white'}}>Absent</Text>
    </TouchableOpacity>
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
    width:200,
    height:50,
    backgroundColor: 'green',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:50,
    borderRadius:10
  },
  checkOut: {
    width:200,
    height:50,
    backgroundColor: 'grey',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:50,
    borderRadius:10
  },
})

export default Home;