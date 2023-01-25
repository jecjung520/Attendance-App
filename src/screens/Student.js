import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect, useState } from 'react';
import { firebase } from '../../Config';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const Student = () => {

  const curDate = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
  return (
    <SafeAreaView style = {styles.container}>
      <StatusBar></StatusBar>
      <View style = {styles.innerContainer}>
        <View>
          <Image source={require('../images/cityu.png')} style={styles.cityu}/>
        </View>
        <View>
          <Text style={styles.innerText}>CityU Attendance</Text>
          <Text style={styles.date}>{curDate}</Text>
        </View>
      </View>

      <Text style={styles.take}>Take Attendance</Text>
      <View style={{height:80, marginTop:20, marginBottom:20}}>
        <ScrollView style={styles.weekday} horizontal>  
          <View style={styles.weekbox}>
            <Text>MON</Text>
            <Text style={{fontWeight:'bold'}}>1</Text>
          </View>
          <View style={styles.weekbox}>
            <Text>TUE</Text>
            <Text style={{fontWeight:'bold'}}>1</Text>
          </View>
          <View style={styles.weekbox}>
            <Text>WED</Text>
            <Text style={{fontWeight:'bold'}}>1</Text>
          </View>
          <View style={styles.weekbox}>
            <Text>THU</Text>
            <Text style={{fontWeight:'bold'}}>1</Text>
          </View>
          <View style={styles.weekbox}>
            <Text>FRI</Text>
            <Text style={{fontWeight:'bold'}}>1</Text>
          </View>
        </ScrollView>
      </View>

      <View>
        <View style={styles.time}>
          <Text style={{color:'grey'}}>7:00   -   08:00</Text>
          <View style={styles.freeArea}>
            <Text style={{color:'grey'}}>free</Text>
            <View style={styles.radio}></View>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  innerContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DBE2EB',
    borderBottomWidth: 1,
  },
  cityu: {
    width: 80,
    height: 40,
    justifyContent: 'center'
  },
  innerText: {
    marginLeft: 10,
    fontWeight:'bold',
    color:'grey',
    fontSize:18,
  },
  date: {
    marginLeft: 10,
    fontSize:13,
  },
  take: {
    fontWeight:'bold',
    color:'grey',
    fontSize:20,
    marginTop:20
  },
  weekbox: {
    height:73,
    width:63,
    borderColor: 'grey',
    borderWidth:1,
    borderRadius:12,
    justifyContent:'center',
    alignItems:'center',
    marginRight:5
  },
  time: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  freeArea: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  radio: {
    height:15,
    width:15,
    borderRadius:15,
    borderColor: 'grey',
    borderWidth:1,
    marginLeft:10
  }
})

export default Student;
