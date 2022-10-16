import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";

function ActivityComponent(props) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        width: responsiveScreenWidth(45),
        height: responsiveScreenHeight(15),
        backgroundColor: props.backgroundColor,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          paddingTop: responsiveScreenHeight(1),
          paddingLeft: responsiveScreenWidth(3),
          fontSize: responsiveScreenFontSize(2.5),
          fontWeight: "bold",
          color: props.labelColor,
        }}
      >
        {props.label}
      </Text>
      <Icon
        name={props.iconName}
        style={{
          paddingTop: responsiveScreenHeight(0.5),
          paddingLeft: responsiveScreenWidth(30),
        }}
        size={40}
        color={props.labelColor}
      />
    </TouchableOpacity>
  );
}

export default ActivityComponent;
