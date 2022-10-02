import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

function ActivityComponent(props) {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
            width: 188,
            height: 110,
            backgroundColor: props.backgroundColor,
            borderRadius: 8
            }}
        >
            <Text style={{
                paddingTop: 15,
                paddingLeft: 15,
                fontSize: 20,
                fontWeight: "bold",
                color: props.labelColor
            }}>{props.label}</Text>
            <Icon name={props.iconName} style={{paddingTop: "5%", paddingLeft: "70%"}} size={45} color={props.labelColor}/>
        </TouchableOpacity>
    );
}

export default ActivityComponent;