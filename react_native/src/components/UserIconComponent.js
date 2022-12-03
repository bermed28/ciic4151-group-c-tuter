import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {responsiveFontSize, responsiveHeight} from "react-native-responsive-dimensions";

const NewProfilePicture = ( props ) => {
    const colors = ["#60BE79", "#B7BD5C", "#9FAFA1", "#9FAFA1", "#F6EDD9"];
    const genColor = () => {
        // return colors[Math.floor(Math.random() * colors.length)]
        return colors[4]
    };

    return (
        <View style={{alignItems: "center", height: responsiveHeight(2.5)}}>
            <View style={[styles.newProfilePicture, {backgroundColor: genColor(), width: props.size, height: props.size,
            top: props.top}]}>
                <Text style={{fontSize: responsiveFontSize(props.font_size)}}>
                    {props.name != null ? props.name.split(" ").length > 1 ?
                        props.name.split(" ")[0][0] + props.name.split(" ")[1][0] :
                        props.name.split(" ")[0][0] : ""
                    }
                </Text>
            </View>
        </View>
    )
};

export default NewProfilePicture;

const styles = StyleSheet.create({
    newProfilePicture: {
        position: "relative",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 270,
        borderWidth: 1,
    }
})