import React from "react";
import {Text, TouchableOpacity} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {responsiveWidth} from "react-native-responsive-dimensions";

function NavigationActionButtonComponent(props) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{
                backgroundColor: props.buttonColor,
                width: props.width,
                height: props.height,
                borderRadius: 10,
                alignItems: "center",
                flexDirection: "row-reverse",
                justifyContent: "flex-end",
                marginTop: props.margin,
                marginBottom: props.margin,
            }}>
            <Text style={{
                color: props.labelColor,
                fontSize: 12,
                fontWeight: "bold",
                marginLeft: responsiveWidth(2.5)
            }}>{props.label}</Text>
            <Feather
                name="chevron-right"
                color={"#000000"}
                size={15}
                style={{position: "absolute", left: responsiveWidth(2)}}
            />
        </TouchableOpacity>
    );
}

export default NavigationActionButtonComponent;