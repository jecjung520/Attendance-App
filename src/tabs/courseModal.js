import React from 'react';
import { Text, View } from 'react-native';
import { Modal } from 'react-native-paper';

const courseModal = ({visible}) => {
    return (
        <Modal visible={false} animationType='fade'>
            <Text>Course Add Modal</Text>
        </Modal>
    )
}

export default courseModal;
