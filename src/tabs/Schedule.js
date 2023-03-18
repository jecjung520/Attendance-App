import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agenda } from 'react-native-calendars';
import { genTimeBlock } from 'react-native-timetable';
import TimeTableView from 'react-native-timetable/components/TimeTable/TimeTableView';
import { firebase } from '../../Config';
let userId = '';

const events_data = [
  {
    title: "Math",
    startTime: genTimeBlock("MON", 9),
    endTime: genTimeBlock("MON", 10, 50),
    location: "Classroom 403",
    extra_descriptions: ["Kim", "Lee"],
  },
  {
    title: "Math",
    startTime: genTimeBlock("WED", 9),
    endTime: genTimeBlock("WED", 10, 50),
    location: "Classroom 403",
    extra_descriptions: ["Kim", "Lee"],
  },
  {
    title: "EE4146",
    startTime: genTimeBlock("MON", 11),
    endTime: genTimeBlock("MON", 11, 50),
    location: "Lab 404",
    extra_descriptions: ["Einstein"],
  },
  {
    title: "Physics",
    startTime: genTimeBlock("WED", 11),
    endTime: genTimeBlock("WED", 11, 50),
    location: "Lab 404",
    extra_descriptions: ["Einstein"],
  },
  {
    title: "Mandarin",
    startTime: genTimeBlock("TUE", 9),
    endTime: genTimeBlock("TUE", 10, 50),
    location: "Language Center",
    extra_descriptions: ["Chen"],
  },
  {
    title: "Japanese",
    startTime: genTimeBlock("FRI", 9),
    endTime: genTimeBlock("FRI", 10, 50),
    location: "Language Center",
    extra_descriptions: ["Nakamura"],
  },
  {
    title: "Club Activity",
    startTime: genTimeBlock("THU", 9),
    endTime: genTimeBlock("THU", 10, 50),
    location: "Activity Center",
  },
  {
    title: "Club Activity",
    startTime: genTimeBlock("FRI", 13, 30),
    endTime: genTimeBlock("FRI", 14, 50),
    location: "Activity Center",
  },
];

const Schedule = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchData = async() => {
    userId = await AsyncStorage.getItem('USERID');
    console.log(userId);
    const userRef = firebase.firestore().collection('users').doc(userId);
    const course = (await userRef.get()).data().Course;
    console.log(course);
    const courseId = course.match(/\/courses\/(.*)/)[1];
    console.log(courseId);
    // const courseRef = firebase.firestore().collection('courses').doc(course); 
    // const doc = await courseRef.get();
    // console.log(doc.data().name);
    // setTitle(doc.data().name);
    // const time = doc.data().time;
    // console.log(time);
  };

  const handleRefresh = async() => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const numOfDays = 5;
  const pivotDate = genTimeBlock('mon');
  // constructor(props) {
  //   super(props);
  //   this.numOfDays = 5;
  //   this.pivotDate = genTimeBlock('mon');
  // }

  const onEventPress = (evt) => {
    Alert.alert("onEventPress", JSON.stringify(evt));
  };

  const retrieveSchedule = () => {

  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        />
      }
    >
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TimeTableView
          scrollViewRef={(ref) => {
            timetableRef = ref;
          }}
          events={events_data}
          pivotTime={9}
          pivotEndTime={20}
          nDays={6}
          onEventPress={onEventPress}
          headerStyle={styles.headerStyle}
          formatDateHeader="dddd"
          locale="en"
        />
      </View>
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#81E1B8'
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

export default Schedule;