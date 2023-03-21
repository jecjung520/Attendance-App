import React, { useState, Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { firebase } from '../../Config';
//import firestore from '@react-native-firebase/firestore';
import Loader from '../common/Loader';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker';

const Signup = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selected, setSelected] = useState('');

  const handleSelected = (value) => {
    setSelected(value);
  }

  const saveDataOnFirestore = () => {
    let userId = uuid.v4().substring(0,8);
    if (selected === 'T') {
      userId = 'T' + userId.substring(1);
    }
    setModalVisible(true);

    firebase.firestore()
      .collection('users')
      .doc(userId)
      .set({
        name: name,
        email: email,
        password: password,
        userId: userId,
      })
      .then(() => {
        console.log('User added!');
        setModalVisible(false);
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
        style={styles.idpw} />
      <View style={{ flexDirection:'row',alignItems:'center'}}>
      <Text>Please select an option:     </Text>
      <Picker
        selectedValue={selected}
        onValueChange={setSelected}
        style={{ justifyContent:'flex-start', height:50, width: 150 }}
      >
        <Picker.Item label="Teacher" value="T" />
        <Picker.Item label="Student" value="S" />
      </Picker>
      </View>
      <TouchableOpacity
        style={styles.but}
        onPress={() => {
          if (name !== '' && email !== '' && password !== '')
            saveDataOnFirestore();
          else
            alert("Please Enter All Data")
        }}>
        <Text style={{ color: '#fff', fontSize: 20 }}>Sign up</Text>
      </TouchableOpacity>
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
  }
});

export default Signup;