import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { firebase } from '../../Config';

const Teacher = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [course, setText1] = useState('');
    const [courseName, setText2] = useState('');

    const handleButtonPress = () => {
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
        firebase.firestore()
            .collection('courses')
            .doc(userId)
            .set({
                course: course,
                name: courseName
            })
            .then(() => {
                console.log('Course Added!');
                setModalVisible(false);
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
        <View style={{flex:1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Manage Courses</Text>
            </View>

            <Text style={styles.dateText}>{curDate}</Text>

            <View style={styles.buttonStyle}>
                <TouchableOpacity style={styles.addButton} onPress={setModalVisible(true)}>
                    <Text style={{color:'white'}}>Add Courses</Text>
                </TouchableOpacity>
                <Modal visible={modalVisible} onRequestClose={setModalVisible(false)}>
                    <TextInput
                    style={styles.text}
                    placeholder="Enter Course Code"
                    value={course}
                    onChangeText={txt => setText1(txt)}
                    />
                    <TextInput
                    style={styles.text}
                    placeholder="Enter Course Name"
                    value={courseName}
                    onChangeText={txt => setText2(txt)}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => {
                        if (course !== '' && courseName !== '')
                            handleButtonPress();
                        else
                            alert("Please Enter All Data")
                    }}>
                    <Text>Save</Text>
                    </TouchableOpacity>
                </Modal>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={{color:'white'}}>Add Students</Text>
                </TouchableOpacity>
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
    text: {
        alignSelf: 'center',
        marginTop: 50,
        textDecorationLine: 'underline',
        fontSize: 18,
        fontWeight: '600',
    }
})

export default Teacher;
