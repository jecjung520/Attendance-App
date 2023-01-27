import React, { Component, useState } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
};

const Schedule = () => {
    const [items, setItems] = useState([]);

    const loadItems = (day) => {
        setTimeout(() => {
          for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
    
            if (!items[strTime]) {
              items[strTime] = [];
              
              const numItems = Math.floor(Math.random() * 3 + 1);
              for (let j = 0; j < numItems; j++) {
                items[strTime].push({
                  name: 'Item for ' + strTime + ' #' + j,
                  height: Math.max(50, Math.floor(Math.random() * 150)),
                  day: strTime
                });
              }
            }
          }
          
          const newItems = {};
          Object.keys(items).forEach(key => {
            newItems[key] = items[key];
          });
          setItems(newItems);
        }, 1000);
      }

    // const renderItem = (item) => {
    //     return (
    //         <TouchableOpacity>
    //             <Card>
    //                 <Card.content>
    //                     <View>
    //                         <Text>{item.name}</Text>
    //                     </View>
    //                 </Card.content>
    //             </Card>
    //         </TouchableOpacity>
    //     )
    // }
    
    return (
        <View style={{flex:1}}>
            <Agenda
            items={items}
            loadItemsForMonth={loadItems}
            selected={new Date().getTime()}
            // renderItem={renderItem}
        />
        </View>
    )
}

export default Schedule;
