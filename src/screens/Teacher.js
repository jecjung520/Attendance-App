import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { firebase } from '../../Config';

const Teacher = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [course, setText1] = useState('');
    const [courseName, setText2] = useState('');
    const navigation = useNavigation();    

    const handleButtonPress = async () => {
        // Do something with text1 and text2 values
        // const uploadCheckIn = () => {
        //     let currentTime = (new Date().getHours() + ":" + new Date().getMinutes());
        //     attendanceList.push({ checkIn: currentTime, checkOut: '', date: currentDate });
        //     firebase.firestore()
        //       .collection('users')
        //       .doc(userId)
        //       .update({
        //         attendance: attendanceList
        //       })
        //       .then(() => {
        //         console.log('User updated!');
        //       });
        //     attendanceList = [];
        //     firebase.firestore()
        //       .collection('users')
        //       .doc(userId)
        //       .onSnapshot(documentSnapshot => {
        //         console.log('User data: ', documentSnapshot.data().attendance);
        //         if (documentSnapshot.data().attendance !== undefined) {
        //           documentSnapshot.data().attendance.map(item => {
        //             attendanceList.push(item);
        //           });
        //         }
        //       });
        //   };
        setModalVisible(true);
        firebase.firestore()
            .collection('courses')
            .doc(userId)
            .set({
                course: course,
                name: courseName
            })
            .then(() => {
                setModalVisible(false);
                console.log('Course Added!');
                // navigation.goBack();
            })
    };

    useEffect(() => {
        setCurrentDate(
            new Date().getDate() +
            "/" +
            (new Date().getMonth() + 1) +
            "/" +
            new Date().getFullYear(),
        );
        saveDate();
    }, []);

    const curDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();

    const saveDate = async () => {
        await AsyncStorage.setItem('Date', curDate);
    }

    // const uploadCheckIn = () => {
    //     let currentTime = (new Date().getHours() + ":" + new Date().getMinutes());
    //     attendanceList.push({ checkIn: currentTime, checkOut: '', date: currentDate });
    //     firebase.firestore()
    //       .collection('users')
    //       .doc(userId)
    //       .update({
    //         attendance: attendanceList
    //       })
    //       .then(() => {
    //         console.log('User updated!');
    //       });
    //     attendanceList = [];
    //     firebase.firestore()
    //       .collection('users')
    //       .doc(userId)
    //       .onSnapshot(documentSnapshot => {
    //         console.log('User data: ', documentSnapshot.data().attendance);
    //         if (documentSnapshot.data().attendance !== undefined) {
    //           documentSnapshot.data().attendance.map(item => {
    //             attendanceList.push(item);
    //           });
    //         }
    //       });
    //   };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Manage Courses</Text>
            </View>

            <Text style={styles.dateText}>{curDate}</Text>

            <View style={styles.buttonStyle}>
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    navigation.navigate('Course')
                }}>
                    <Text style={{ color: 'white' }}>Add Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={{ color: 'white' }}>Add Students</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.courseView}>
                <View style={styles.row}>
                    <View style={styles.square1} />
                    <View style={styles.square2} />
                </View>
                <View style={styles.row}>
                    <View style={styles.square3} />
                    <View style={styles.square4} />
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
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
    buttonStyle: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    addButton: {
        width: 100,
        height: 50,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 50,
        borderRadius: 10,
    },
    courseView: {
        marginTop: 60,
        height: 500,
        width: 300,
        borderColor: 'purple',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 5,
        position: 'relative',
    },
    courseHeading: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        color: '#000',
        fontWeight: '700',
        fontSize: 14
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    square1: {
        flex: 1,
        backgroundColor: 'red',
    },
    square2: {
        flex: 1,
        backgroundColor: 'blue',
    },
    square3: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    square4: {
        flex: 1,
        backgroundColor: 'green',
    },
})

export default Teacher;
