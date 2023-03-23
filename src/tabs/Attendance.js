import React, { Component, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const Attendance = ({ navigation }) => {
  const [QRvalue, setQRValue] = useState(' ');
  const [QRLogo, setQRLogo] = useState('');
  const [QRImage, setQRImage] = useState('');
  const ref = useRef();

  const handleShare = async () => {
    const options = {
      title: 'Share your QRcode',
      url: QRImage,
    }
    try {
      await Share.share(options);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Take Attendance</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="Add Value to QRCode"
            style={styles.textInput}
            autoCapitalize="none"
            value={QRvalue}
            // onChangeText={setQRValue}
            onChangeText={(text) => setQRValue(text)}
          />
          <TextInput
            placeholder="Add Logo URL"
            style={styles.textInput}
            autoCapitalize="none"
            value={QRLogo}
            onChangeText={setQRLogo}
          />
        </View>
        <QRCode
          size={350}
          value={QRvalue}
          logo={{ uri: QRLogo }}
          logoSize={60}
          logoBackgroundColor='transparent'
          getRef={ref}
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => GenerateQR()}>
            <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>Generate QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => handleShare()}>
            <Text style={[styles.sectionDescription, { color: '#fff', fontWeight: '900' }]}>Share QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  highlight: {
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginRight: 20,
    marginVertical: 20,
    borderRadius: 20,
    width: 162,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  newButton: {
    backgroundColor: 'deepskyblue',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 75,
    borderRadius: 20,
    paddingBottom: 17,
  },
  Button: {
    backgroundColor: 'deepskyblue',
    marginTop: 32,
    marginRight: 50,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 20,
    paddingBottom: 17,
  },
});

export default Attendance;
