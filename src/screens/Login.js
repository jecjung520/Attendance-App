import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { firebase } from '../../Config';
import { getDatabase, ref, onValue} from "firebase/compat/database";
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const checkLogin = async() => {
    setModalVisible(true);
    firebase.firestore()
      .collection('users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        setModalVisible(false);
        console.log(querySnapshot.docs[0].data());
        if (password === querySnapshot.docs[0].data().password) {
          nextScreen(querySnapshot.docs[0].data());
        } else {
          alert("Wrong Password");
        }
      });
  }
  const nextScreen = async data =>{
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USERID', data.userId);
    navigation.navigate('Main');
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Enter Email Id"
        value={email}
        onChangeText={txt => setEmail(txt)}
        style={styles.idpw} />

      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={txt => setPassword(txt)}
        style={styles.idpw} />

      <TouchableOpacity
        style={styles.but}
        onPress={() => {
          if (email !== '' && password !== '') {
            checkLogin();
          } else {
            alert("Please Enter Correct ID or Password")
          }
        }}>
        <Text style={{ color: '#fff', fontSize: 20 }}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.text} onPress={() => {
        navigation.navigate('Signup')
      }}>Create New Account</Text>
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
    marginTop: 50
  },
  but: {
    width: '90%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 10,
    marginTop: 50,
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
  }
});

export default Login;
