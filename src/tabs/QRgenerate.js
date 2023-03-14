import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Linking, ToastAndroid } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

const QRgenerate = () => {
  const [inputValue, setInputValue] = useState(' ');
  const [qrCodeValue, setQrCodeValue] = useState(' ');

  useEffect(() => {
    setInputValue(inputValue);
    setQrCodeValue(`https://localhost:3000/qrcode?value=${inputValue}`);
  }, []);

  const onGenerateLinkPress = () => {
    const url = `http://localhost:3000/qrcode?value=${inputValue}`;
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
});

export default QRgenerate;
