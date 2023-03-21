import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect, useState } from 'react';
import { firebase } from '../../Config';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
let userId = '';
let extra = [];
let rects = [];

const Student = () => {
  const [rectangles, setRectangles] = useState([]);
  const [attend, setAttend] = useState(false);
  const [curcourse, setcurcourse] = useState('');
  const curDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
  const today = new Date().toLocaleString('default', { weekday: 'short' }).toUpperCase().substring(0, 3);
  console.log(today);

  const fetchData = async () => {
    rects = [];
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
        rects.push(<TouchableOpacity>
          <View style={styles.rectangle}>
            <Text style={styles.rectangleText}>{courseItem}: {title}</Text>
            <Text style={{ marginLeft: 10 }}>{time.substring(1)}                                         {location}</Text>
          </View>
        </TouchableOpacity>);
      }

      // split time into start and end times
      const timeRange = time.substring(1);
      const [startTime, endTime] = timeRange.split("~");

      // extract minute from end time
      const endMinute = endTime.substring(3);

      const currentTime = new Date().toLocaleTimeString();
      if (currentTime.substring(0, 2) >= startTime.substring(0, 2) && currentTime.substring(0, 2) <= endTime.substring(0, 2)) {
        setAttend(true);
        setcurcourse(courseItem);
      } else {
        setAttend(false);
      }
    }
    console.log(rects);
    if (rects.length > 0) {
      setRectangles(rects);
    }
    console.log(rectangles);
  }


  useEffect(() => {
    fetchData();
  }, []);

  const navigation = useNavigation();

  const handlePress = () => {
    if (attend) {
      Alert.alert(
        'Confirm Navigation',
        'Are you sure you want to navigate to the Scan Screen?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Navigation cancelled'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('ScanScreen', { curcourse }),
          },
        ]
      );
    } else {
      alert('No Classes to Attend');
    }
  };

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
          <TouchableOpacity>
            <View style={today == "MON" ? styles.curbox : styles.weekbox}>
              <Text>MON</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={today == "TUE" ? styles.curbox : styles.weekbox}>
              <Text>TUE</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={today == "WED" ? styles.curbox : styles.weekbox}>
              <Text>WED</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={today == "THU" ? styles.curbox : styles.weekbox}>
              <Text>THU</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={today == "FRI" ? styles.curbox : styles.weekbox}>
              <Text>FRI</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.takeAttendance} onPress={handlePress}>
        <Text style={{ alignSelf: 'center' }}>Attend</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
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
    height: 60,
    width: 59,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  curbox: {
    height: 66,
    width: 65,
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
    width: 300,
    height: 50,
    margin: 10,
    backgroundColor: '#247BA0',
    borderRadius: 12,
    justifyContent: 'center',
  },
  rectangleText: {
    color: 'white',
    marginLeft: 10,
  },
  takeAttendance: {
    width: 60,
    height: 25,
    backgroundColor: '#03A9F4',
    justifyContent: 'center',
    borderRadius: 5
  }
})

export default Student;
