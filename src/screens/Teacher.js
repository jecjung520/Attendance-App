import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Button } from 'react-native';
import { firebase } from '../../Config';

const Rectangle = ({ text }) => {
    return (
        <View style={styles.rectangle}>
            <Text style={styles.rectangleText}>{text}</Text>
        </View>
    );
};

const OpenCourses = ({ visible, onClose, onSave }) => {
    const [input1Value, setInput1Value] = useState('');
    const [input2Value, setInput2Value] = useState('');

    const handleSave = () => {
        // Handle saving the input values here
        if (input1Value !== '' && input2Value !== '') {
            console.log('Input 1:', input1Value);
            console.log('Input 2:', input2Value);

            onSave({ input1Value, input2Value });
            // Close the popup
            onClose();
        } else {
            alert('Please enter all data');
        }
    };

    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add Courses</Text>
                </View>
                <TextInput
                    placeholder="Enter input 1"
                    value={input1Value}
                    onChangeText={setInput1Value}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter input 2"
                    value={input2Value}
                    onChangeText={setInput2Value}
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                    <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const OpenStudents = ({ visible, onClose }) => {
    const [input1Value, setInput1Value] = useState('');
    const [input2Value, setInput2Value] = useState('');
    const [input3Value, setInput3Value] = useState('');

    const handleSave = () => {
        // Handle saving the input values here
        if (input1Value !== '' && input2Value !== '') {
            console.log('Input 1:', input1Value);
            console.log('Input 2:', input2Value);
            SaveStudents();
            // Close the popup
            onClose();
        } else {
            alert('Please enter all data');
        }
    };

    const SaveStudents = () => {
        firebase.firestore()
        .collection('courses')
        .doc(input1Value)
        .update({
          Students: firebase.firestore.FieldValue.arrayUnion(input2Value)
        })
        .then(() => {
          console.log('User updated!');
        });
        firebase.firestore()
        .collection('users')
        .doc(input3Value)
        .update({
          Course: firebase.firestore.FieldValue.arrayUnion(input1Value)
        })
        .then(() => {
            console.log('Course Added');
        });
    };

    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add Students</Text>
                </View>
                <TextInput
                    placeholder="Enter Course"
                    value={input1Value}
                    onChangeText={setInput1Value}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter Student Name"
                    value={input2Value}
                    onChangeText={setInput2Value}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter SID"
                    value={input3Value}
                    onChangeText={setInput3Value}
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                    <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const Teacher = () => {
    const [date, setCurrentDate] = useState('');
    const [isPopupVisible1, setIsPopupVisible1] = useState(false);
    const [isPopupVisible2, setIsPopupVisible2] = useState(false);
    const [rectangles, setRectangles] = useState([]);

    const handleOpenPopup = () => {
        setIsPopupVisible1(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible1(false);
    };

    const handleOpenStudent = () => {
        setIsPopupVisible2(true);
    };

    const handleCloseStudent = () => {
        setIsPopupVisible2(false);
    };

    const handleSavePopup = (data) => {
        const newRectangle = {
            id: Date.now(),
            text: `${data.input1Value} - ${data.input2Value}`,
        };
        setRectangles([...rectangles, newRectangle]);
    };

    const navigation = useNavigation();

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

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Manage Courses</Text>
            </View>

            <Text style={styles.dateText}>{curDate}</Text>

            <View style={styles.buttonStyle}>
                {/* <TouchableOpacity style={styles.addButton} onPress={() => {
                    navigation.navigate('Course')
                }}>
                    <Text style={{ color: 'white' }}>Add Courses</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.addButton} onPress={handleOpenPopup}>
                    <Text style={{ color: 'white' }}>Add Courses</Text>
                </TouchableOpacity>
                <OpenCourses visible={isPopupVisible1} onClose={handleClosePopup} onSave={handleSavePopup} />

                {/* <TouchableOpacity style={styles.addButton}>
                    <Text style={{ color: 'white' }}>Add Students</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.addButton} onPress={handleOpenStudent}>
                    <Text style={{ color: 'white' }}>Add Students</Text>
                </TouchableOpacity>
                <OpenStudents visible={isPopupVisible2} onClose={handleCloseStudent} />
            </View>
            {/* <View style={styles.courseView}>
                <View style={styles.row}>
                    <View style={styles.square1} />
                    <View style={styles.square2} />
                </View>
                <View style={styles.row}>
                    <View style={styles.square3} />
                    <View style={styles.square4} />
                </View>
            </View> */}
            <View style={styles.courseView}>
                {rectangles.map((rectangle) => (
                    <Rectangle key={rectangle.id} text={rectangle.text} />
                ))}
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
    textInput: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: 20,
        marginTop: 50
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

export default Teacher;
