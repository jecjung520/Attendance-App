import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { genTimeBlock } from 'react-native-timetable';
import TimeTableView from 'react-native-timetable/components/TimeTable/TimeTableView';
import { firebase } from '../../Config';
let userId = '';
let extra = [];

let events_data = [];

const Schedule = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const extractCourse = async () => {
    events_data = [];
    extra = [];
    userId = await AsyncStorage.getItem('USERID');
    const userRef = firebase.firestore().collection('users').doc(userId);
    const course = (await userRef.get()).data().Course;
    for (const courseItem of course) {
      const courseRef = firebase.firestore().collection('courses').doc(courseItem);
      const doc = await courseRef.get();
      const title = doc.data().name;
      const location = doc.data().location;
      const professor = doc.data().professor;
      extra = [professor];

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

      // split time into start and end times
      const timeRange = time.substring(1);
      const [startTime, endTime] = timeRange.split("~");

      // extract minute from end time
      const endMinute = endTime.substring(3);

      console.log(weekday, startTime.substring(0, 2), endTime.substring(0, 2), endMinute);
      events_data.push({
        title: courseItem,
        startTime: genTimeBlock(weekday, startTime.substring(0, 2)),
        endTime: genTimeBlock(weekday, endTime.substring(0, 2), endMinute),
        location: location,
        extra_descriptions: extra,
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await extractCourse();
    setIsRefreshing(false);
  };

  useEffect(() => {
    extractCourse();
  }, []);

  const onEventPress = (evt) => {
    Alert.alert("onEventPress", JSON.stringify(evt));
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