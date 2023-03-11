import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Splash = ({navigation}) => {
  useEffect(()=>{
    setTimeout(()=>{
      navigation.navigate('Login');
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Attendance</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Splash;
