import React, { useState, Component, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { firebase } from '../../Config';
import Loader from '../common/Loader';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as Application from 'expo-application';

const auth = Math.floor(100000 + Math.random() * 900000);
const id = Application.androidId;

const Signup = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [inputValue, setInputValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selected, setSelected] = useState('');

  const handleConfirmation = () => {
    console.log(auth);
    if (inputValue == auth) {
      saveDataOnFirestore();
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  };

  const startCountdown = useCallback(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setModalVisible(false);
    }
  }, [countdown]);

  const handlePress = () => {
    sendEmail(email, 'Authentication Email', auth);
    setCountdown(60);
    setModalVisible(true);
  };


  useEffect(() => {
    if (modalVisible) {
      startCountdown();
    }
  }, [modalVisible, startCountdown]);


  const handleSelected = (value) => {
    setSelected(value);
  }

  const sendEmail = async (to, subject, text) => {
    try {
      const response = await axios.post('http://10.0.2.2:3001/send-email', {
        to,
        subject,
        text,
      });
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const saveDataOnFirestore = () => {
    let userId = uuid.v4().substring(0, 8);
    if (selected === 'T') {
      userId = 'T' + userId.substring(1);
    }
    // setModalVisible(true);

    firebase.firestore()
      .collection('users')
      .doc(userId)
      .set({
        name: name,
        email: email,
        password: password,
        userId: userId,
        deviceId: id,
      })
      .then(() => {
        // sendEmail(email, 'Authentication Email', auth);
        console.log('User added!');
        // setModalVisible(false);
        navigation.goBack();
      });
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={txt => setName(txt)}
        style={styles.idpw} />
      <TextInput
        placeholder="Enter Email Id"
        value={email}
        onChangeText={txt => setEmail(txt)}
        style={styles.idpw} />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={txt => setPassword(txt)}
        style={styles.idpw}
        secureTextEntry={true} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Please select an option:     </Text>
        <Picker
          selectedValue={selected}
          onValueChange={setSelected}
          style={{ justifyContent: 'flex-start', height: 50, width: 150 }}
        >
          <Picker.Item label="Teacher" value="T" />
          <Picker.Item label="Student" value="S" />
        </Picker>
      </View>
      <TouchableOpacity
        style={styles.but}
        onPress={() => {
          if (name !== '' && email !== '' && password !== '')
            // saveDataOnFirestore();
            handlePress();
          else
            alert("Please Enter All Data")
        }}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>Sign up</Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>Countdown: {countdown} seconds</Text>
            <TextInput style={styles.modalText}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder="Enter Code"
            />
            <TouchableOpacity onPress={handleConfirmation} style={{ backgroundColor: '#007AFF', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 5 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Confirm</Text>
            </TouchableOpacity>
          </View>
          {/* {confirmed && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginLeft: 5, color: 'green' }}>Confirmed</Text>
            </View>
          )} */}
          {/* <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
            <Text style={{ color: '#FFFFFF' }}>Close</Text>
          </TouchableOpacity> */}
        </View>
      </Modal>
      {/* <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} /> */}
      <View>
        <Text style={styles.text} onPress={() => navigation.navigate('Login')}>Already have account</Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  idpw: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    paddingLeft: 20,
    marginTop: 20
  },
  but: {
    width: '90%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    marginTop: 50,
    textDecorationLine: 'underline',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalText: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },

});

export default Signup;