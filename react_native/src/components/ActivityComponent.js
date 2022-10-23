import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

function ActivityComponent(props) {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
            width: responsiveWidth(44),
            height: responsiveHeight(12.5),
            backgroundColor: props.backgroundColor,
            borderRadius: 8
            }}
            onPress={props.onPress}
        >
            <Text style={{
                paddingTop: 15,
                paddingLeft: 15,
                fontSize: responsiveFontSize(2.2),// 2% of total window size,
                fontWeight: "bold",
                color: props.labelColor
            }}>{props.label}</Text>
            <Icon name={props.iconName} style={{paddingTop: "5%", paddingLeft: "68%"}} size={45} color={props.labelColor}/>
        </TouchableOpacity>
    );
}

export default ActivityComponent;