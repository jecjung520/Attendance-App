import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList } from 'react-native';

export default class basicFlatListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        deleteRowKey: null,
    };
  }
  refreshFlatList = (deletedKey) => {
    this.setState((prevState) => {
        return {
            deletedRowKey: deletedKey
        };
    });
  }
  _onPressAdd() {
    alert("Course Added");
  }

  render() {
    return (
      <View style={styles.base}>
        <View style={styles.second}>
            <TouchableHighlight
                style = {{marginRight: 10}}
                underlayColor = 'tomato'
                onPress={this._onPressAdd}
            >
            </TouchableHighlight>
        </View>
        <FlatList
            data={flatListData}
            renderItem={({item, index}) => {
                return (
                    <FlatListItem item={item} index={index} parentFlatList={this}>
                        <Text>
                            asd
                        </Text>
                    </FlatListItem>
                );
            }}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    base: {
        flex: 1,
        marginTop: 0
    },
    second: {
        backgroundColor: 'tomato',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 64,
    },
});