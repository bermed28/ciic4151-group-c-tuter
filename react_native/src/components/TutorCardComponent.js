import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {responsiveWidth} from "react-native-responsive-dimensions";

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
                borderWidth: 2,
                borderColor: "#000000",
                borderRadius: "100%",
                marginLeft: responsiveWidth(2)
            }}>
                <Feather
                    name="user"
                    color={"#000000"}
                    size={"50%"}
                    style={{alignItems: "flex-start", }}
                />
            </View>
            <View style={{
                flexDirection: "column",
                marginLeft: responsiveWidth(2)
            }}>
                <Text style={{
                    color: props.labelColor,
                    fontSize: 24,
                    fontWeight: "bold",
                }}>
                    {props.label}
                </Text>
                <View style={{flexDirection: "row"}}>
                    {
                        props.courseLabels.map((label) => {
                            return (
                                <View style={{
                                    borderRadius: 5,
                                    backgroundColor: "#F2F2F2",
                                    margin: responsiveWidth(1),
                                    padding: responsiveWidth(2),
                                }}>
                                    <Text style={{
                                        fontSize: 10,
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