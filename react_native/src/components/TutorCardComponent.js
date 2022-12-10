import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {responsiveWidth} from "react-native-responsive-dimensions";
import NewProfilePicture from "./UserIconComponent";

function TutorCardComponent(props) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{
                backgroundColor: props.buttonColor,
                width: props.width,
                height: props.height,
                borderRadius: 10,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginTop: props.margin,
                marginBottom: props.margin,
            }}>
            <View style={{
                marginLeft: responsiveWidth(1.5)
            }}>
                <NewProfilePicture name={props.label} size={50} font_size={2} top={"-100%"}/>
            </View>
            <View style={{
                flexDirection: "column",
                marginLeft: responsiveWidth(2)
            }}>
                <Text style={{
                    color: props.labelColor,
                    fontSize: 20,
                    fontWeight: "bold",
                }}>
                    {props.label + ` (${props.department})`}
                </Text>
                <View style={{flexDirection: "row"}}>
                    {
                        props.courseLabels.map((label, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{
                                    borderRadius: 5,
                                    backgroundColor: "#F2F2F2",
                                    margin: responsiveWidth(0.5),
                                    padding: responsiveWidth(2),
                                }}>
                                    <Text style={{
                                        fontSize: 10
                                    }}>{label}</Text>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default TutorCardComponent;