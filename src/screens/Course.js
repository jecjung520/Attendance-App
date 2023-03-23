import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Loader from '../common/Loader';
import { firebase } from '../../Config';
import { useNavigation } from '@react-navigation/native';

const Course = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [course, setText1] = useState('');
    const [courseName, setText2] = useState('')
    const navigation = useNavigation();

    const handleButtonPress = async () => {
        setModalVisible(true);
        firebase.firestore()
            .collection('courses')
            .doc(course)
            .set({
                course: course,
                name: courseName,
                hash: ''
            })
            .then(() => {
                setModalVisible(false);
                console.log('Course Added!');
                navigation.goBack();
            })
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
});

export default Course;