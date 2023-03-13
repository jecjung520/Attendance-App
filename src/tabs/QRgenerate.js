import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRgenerate = () => {
  const [inputValue, setInputValue] = useState('asd');
  const [qrCodeValue, setQrCodeValue] = useState('asd');

  useEffect(() => {
    const interval = setInterval(() => {
      setQrCodeValue(`https://www.example.com/${inputValue}/${Math.random().toString(36).substring(7)}`);
    }, 5000);
    return () => clearInterval(interval);
  }, [inputValue]);

  const onGenerateLinkPress = () => {
    const webAppUrl = 'http://localhost:3000';
    const inputValue = 'EE4146';
    const urlWithInputValue = `${webAppUrl}?inputValue=${encodeURIComponent(inputValue)}`;
    Linking.openURL(urlWithInputValue);
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
      <Text style={styles.title}>QR Code Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text to encode"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <View style={styles.qrCodeContainer}>
        <QRCode value={qrCodeValue} size={200} />
      </View>
      <TouchableOpacity style={styles.button} onPress={onGenerateLinkPress}>
        <Text style={styles.buttonText}>Generate Link</Text>
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
});

export default QRgenerate;
