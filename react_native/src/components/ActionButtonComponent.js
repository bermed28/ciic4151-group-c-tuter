import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

function ActionButtonComponent(props){
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{
            backgroundColor : props.buttonColor,
            width : props.width,
            height : props.height,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        }}>
            { props.logo ?
                <View style={{paddingRight: 15}}>
                    <Image source={props.logo} style={[
                        props.logoSize,
                    ]}/>
                </View>

                : null
            }
            <Text style={{
                color: props.labelColor,
                fontSize: 17,
                fontWeight: props.bold ? "bold" : "normal",
            }}>{props.label}</Text>
        </TouchableOpacity>
    );
}

export default ActionButtonComponent;