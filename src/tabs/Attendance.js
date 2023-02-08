import React, { Component, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const Attendance = ({navigation}) => {
    const [QRvalue, setQRValue] = useState('');
    const [QRLogo, setQRLogo] = useState('');
    const [QRImage, setQRImage] = useState('');
    const ref = useRef();
    
    return (
      <SafeAreaView>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Take Attendance</Text>
          <View style={styles.row}>
            <TextInput 
              placeholder= "Add Value to QRCode"
              style={styles.textInput}
              autoCapitalize="none"
              value={QRvalue}
              onChangeText={setQRValue}
            />
            <TextInput 
              placeholder= "Add Logo URL"
              style={styles.textInput}
              autoCapitalize="none"
              value={QRLogo}
              onChangeText={setQRLogo}
            />
            </View>
        <QRCode
        size={350}
        value={navigation.navigate('Login')}
        logoSize={60}
        logoBackgroundColor='transparent'
        getRef={ref}
      />
      </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
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
});

export default Attendance;
