import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Button } from 'react-native';
import { firebase } from '../../Config';
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';

let rects = [];
let extra = [];

const OpenCourses = ({ visible, onClose }) => {
    const [course, setCourse] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');

    const handleSave = () => {
        // Handle saving the input values here
        if (course !== '' && location !== '' && name !== '' && time !== '') {
            console.log('Course code :', course);
            console.log('Course name :', name);
            console.log('Course location :', location);
            console.log('Course time :', time);
            saveCourse();
            // Close the popup
            onClose();
        } else {
            alert('Please enter all data');
        }
    };

    const saveCourse = async () => {
        userId = await AsyncStorage.getItem('USERID');
        const professorRef = firebase.firestore().collection('users').doc(userId).get();
        const professor = (await professorRef).data().name;

        firebase.firestore()
            .collection('courses')
            .doc(course)
            .set({
                course: course,
                name: name,
                location: location,
                time: time,
                professor: professor,
            })
            .then(() => {
                console.log('Course Added!');
            });
        firebase.firestore()
            .collection('users')
            .doc(userId)
            .update({
                Course: firebase.firestore.FieldValue.arrayUnion(course)
            })
            .then(() => {
                console.log('Course Added');
            });
    };

    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add Courses</Text>
                </View>
                <TextInput
                    placeholder="Enter Course Code"
                    value={course}
                    onChangeText={setCourse}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter Course Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter Course Location"
                    value={location}
                    onChangeText={setLocation}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter Course Time"
                    value={time}
                    onChangeText={setTime}
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
    const [csvColumn, setCsvColumn] = useState([]);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: false,
                copyToCacheDirectory: true,
            });

            if (result.type === 'success') {
                parseDocument(result.uri);
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    };

    const parseDocument = async (uri) => {
        try {
            const response = await fetch(uri);
            const text = await response.text();
            Papa.parse(text, {
                complete: (results) => {
                    extractColumn(results.data, 'name');
                },
                header: true,
            });
        } catch (err) {
            console.error('Error parsing CSV:', err);
        }
    };

    const extractColumn = (data, columnName) => {
        const columnData = data.map((row) => row[columnName]);
        setCsvColumn(columnData);
    };

    const saveToFirestore = async () => {
        try {
            await firebase.firestore()
                .collection('courses')
                .doc(input1Value)
                .set(
                    {
                        Students: csvColumn,
                    },
                    { merge: true },
                );
            console.log('Data saved to Firestore successfully.');
        } catch (err) {
            console.error('Error saving data to Firestore:', err);
        }
    };

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
                <TouchableOpacity onPress={pickDocument} style={styles.button}>
                    <Text style={styles.buttonText}>Pick CSV</Text>
                </TouchableOpacity>
                {csvColumn.length > 0 && (
                    <>
                        <Text style={{ textAlign:'center' }}>Column data:</Text>
                        <Text style={{ textAlign:'center' }}>{JSON.stringify(csvColumn.slice(0,3))}</Text>
                        <TouchableOpacity onPress={saveToFirestore} style={styles.button}>
                            <Text style={styles.buttonText}>Save to Firestore</Text>
                        </TouchableOpacity>
                    </>
                )}

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

    const fetchData = async () => {
        rects = [];
        extra = [];
        userId = await AsyncStorage.getItem('USERID');
        console.log(userId);
        const userRef = firebase.firestore().collection('users').doc(userId);
        const course = (await userRef.get()).data().Course;

        for (const courseItem of course) {
            const courseRef = firebase.firestore().collection('courses').doc(courseItem);
            const doc = await courseRef.get();
            const title = doc.data().name;
            const location = doc.data().location;

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

            rects.push(<TouchableOpacity>
                <View style={styles.rectangle}>
                    <Text style={styles.rectangleText}>{courseItem}: {title}</Text>
                    <Text style={{ marginLeft: 10 }}>{time.substring(1)}                                         {location}</Text>
                </View>
            </TouchableOpacity>);
        }
        console.log(rects);
        // if (rects.length > 0) {
        //     setRectangles(rects);
        // }
        setRectangles(rects);
        console.log(rectangles);
    }

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

    const navigation = useNavigation();

    useEffect(() => {
        setCurrentDate(
            new Date().getDate() +
            "/" +
            (new Date().getMonth() + 1) +
            "/" +
            new Date().getFullYear(),
        );
        fetchData();
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
                <TouchableOpacity style={styles.addButton} onPress={handleOpenPopup}>
                    <Text style={{ color: 'white' }}>Add Courses</Text>
                </TouchableOpacity>
                <OpenCourses visible={isPopupVisible1} onClose={handleClosePopup} />

                <TouchableOpacity style={styles.addButton} onPress={handleOpenStudent}>
                    <Text style={{ color: 'white' }}>Add Students</Text>
                </TouchableOpacity>
                <OpenStudents visible={isPopupVisible2} onClose={handleCloseStudent} />
            </View>
            <View style={{ alignItems: 'center', marginTop: 50 }}>
                {rectangles}
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
    button: {
        backgroundColor: '#2196F3',
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop:10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default Teacher;
