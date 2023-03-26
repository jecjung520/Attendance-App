import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Linking, ToastAndroid } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { firebase } from '../../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const QRgenerate = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const options = [];
  const [list, setList] = useState([]);

  const fetchData = async () => {
    userId = await AsyncStorage.getItem('USERID');
    const userRef = firebase.firestore().collection('users').doc(userId);
    const course = (await userRef.get()).data().Course;
    for (const courseItem of course) {
      options.push(courseItem);
    }
  };

  useEffect(() => {
    fetchData().then(() => {
      setList(options);
    });
    setInputValue(inputValue);
    setQrCodeValue(`https://localhost:3000/auth?value=${selectedOption}`);
  }, []);

  const onGenerateLinkPress = () => {
    const url = `http://localhost:3000/auth?value=${selectedOption}`;
    setQrCodeValue(`https://localhost:3000/auth?value=${selectedOption}`);
    copyToClipboard(url)
      .then(() => {
        ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
      });
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const onShareLinkPress = async () => {
    try {
      await Share.share({
        message: qrCodeValue,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create QR Code</Text>
      </View>
      <View style={styles.textInput}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={setSelectedOption}
        >
          <Picker.Item label='Select an option' value='' />
          {list.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>
      {selectedOption ? (
        <Text style={styles.selectedOption}>You selected {selectedOption}</Text>
      ) : null}
      <View style={styles.qrCodeContainer}>
        <QRCode value={'temp'} size={200} />
      </View>
      <TouchableOpacity style={styles.button} onPress={onGenerateLinkPress}>
        <Text style={styles.buttonText}>Copy Link</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onShareLinkPress}>
        <Text style={styles.buttonText}>Share Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
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
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
});

export default QRgenerate;
