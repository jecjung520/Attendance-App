import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Modal, Text } from 'react-native';

const Loader = ({modalVisible, setModalVisible}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ActivityIndicator size={'large'}/>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        width:100,
        height:100,
        borderRadius:20,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
    },
    centeredView: {
        flex:1,
        backgroundColor:'rgba(0,0,0,.5)',
        justifyContent:'center',
        alignItems:'center',
    }
});

export default Loader;
