import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect, useState } from 'react';
import { firebase } from '../../Config';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
let userId = '';
let extra = [];

const Student = () => {
  const [rectangles, setRectangles] = useState([]);

  const curDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
  const today = new Date().toLocaleString('default', { weekday: 'short' }).toUpperCase().substring(0, 3);
  console.log(today);
  
  const rects = [];

  const fetchData = async () => {
    extra = [];
    userId = await AsyncStorage.getItem('USERID');
    const userRef = firebase.firestore().collection('users').doc(userId);
    const course = (await userRef.get()).data().Course;
    course.forEach(async (course) => {
      const courseRef = firebase.firestore().collection('courses').doc(course);
      const doc = await courseRef.get();
      const title = doc.data().name;
      const location = doc.data().location;
      const professor = doc.data().professor;
      extra.push(professor);

      // extract time
      const time = doc.data().time;
      let weekday = time.charAt(0);
      switch (weekday) {
        case "M":
          weekday = "MON";
          break;
        case "T":
          weekday = "TUE";
          break;
        case "W":
          weekday = "WED";
          break;
        case "R":
          weekday = "THU";
          break;
        case "F":
          weekday = "FRI";
          break;
        case "S":
          weekday = "SUN";
          break;
        default:
          break;
      }
      
      if (today == weekday) {
        rects.push(<View style={styles.rectangle}/>);
      }
      
      // split time into start and end times
      const timeRange = time.substring(1);
      const [startTime, endTime] = timeRange.split("~");

      // extract minute from end time
      const endMinute = endTime.substring(3);

      console.log(weekday, startTime.substring(0, 2), endTime.substring(0, 2), endMinute);
    });
    setRectangles(rects);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.innerText}>Smart Attendance</Text>
          <Text style={styles.date}>{curDate}</Text>
        </View>
      </View>

      <Text style={styles.take}>Take Attendance</Text>
      <View style={{ height: 80, marginTop: 20, marginBottom: 20 }}>
        <ScrollView style={styles.weekday} horizontal>
          <View style={today == "MON" ? styles.curbox : styles.weekbox}>
            <Text>MON</Text>
            <Text style={{ fontWeight: 'bold' }}>1</Text>
          </View>
          <View style={today == "TUE" ? styles.curbox : styles.weekbox}>
            <Text>TUE</Text>
            <Text style={{ fontWeight: 'bold' }}>1</Text>
          </View>
          <View style={today == "WED" ? styles.curbox : styles.weekbox}>
            <Text>WED</Text>
            <Text style={{ fontWeight: 'bold' }}>1</Text>
          </View>
          <View style={today == "THU" ? styles.curbox : styles.weekbox}>
            <Text>THU</Text>
            <Text style={{ fontWeight: 'bold' }}>1</Text>
          </View>
          <View style={today == "FRI" ? styles.curbox : styles.weekbox}>
            <Text>FRI</Text>
            <Text style={{ fontWeight: 'bold' }}>1</Text>
          </View>
        </ScrollView>
      </View>

      {/* <View>
        <View style={styles.time}>
          <Text style={{ color: 'grey' }}>7:00   -   08:00</Text>
          <View style={styles.freeArea}>
            <Text style={{ color: 'grey' }}>free</Text>
            <View style={styles.radio}></View>
          </View>
        </View>
      </View> */}
      <View style={{marginTop:100}}>
        {rectangles}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  innerContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DBE2EB',
    borderBottomWidth: 1,
  },
  cityu: {
    width: 80,
    height: 40,
    justifyContent: 'center'
  },
  innerText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 25,
    alignItems: 'center',
  },
  date: {
    marginLeft: 10,
    fontSize: 13,
  },
  take: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 20,
    marginTop: 20
  },
  weekbox: {
    height: 68,
    width: 59,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  curbox: {
    height: 68,
    width: 59,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    backgroundColor: 'green',
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  freeArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radio: {
    height: 15,
    width: 15,
    borderRadius: 15,
    borderColor: 'grey',
    borderWidth: 1,
    marginLeft: 10
  },
  rectangle: {
    width: 100,
    height: 50,
    backgroundColor: 'green',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangleText: {
    color: 'white',
  },
})

export default Student;
