import React from "react";
import {Text, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

function CourseMastersComponent(props) {
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
            <>{facultyLogos.hasOwnProperty(`${props.icon}`) ? facultyLogos[`${props.icon}`] : facultyLogos["Default"]}</>
        </TouchableOpacity>
    );
}

const facultyLogos = {
    "Engineering": (<Icon name={"gears"} style={{paddingTop: "5%", paddingLeft: "68%"}} size={45}/>),
    "Arts and Sciences":(<Icon name={"university"} style={{paddingTop: "5%", paddingLeft: "68%"}} size={45}/>),
    "Agricultural Sciences": (<Icon name={"leaf"} style={{paddingTop: "5%", paddingLeft: "68%"}} size={45}/>),
    "Business Administration": (<Icon name={"briefcase"} style={{paddingTop: "5%", paddingLeft: "68%"}} size={45}/>),
    "Default": (<Icon name={"handshake-o"} style={{paddingTop: "5%", paddingLeft: "60%"}} size={45}/>)
}

export default CourseMastersComponent;