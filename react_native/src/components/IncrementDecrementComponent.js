import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";

function IncrementDecrementComponent(props){

    return(
        <View style={{flex: 1, flexDirection: "row", alignItems:"center", justifyContent: "space-evenly"}}>
            <TouchableOpacity onPress={props.onChangeIncrement}>
                <View style={{
                    backgroundColor: "#069044",
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent:"center",
                    width: responsiveWidth(10),
                    height: responsiveHeight(3)
                }}>
                    <Text style={{fontWeight: "bold", color: "white"}}>+</Text>
                </View>
            </TouchableOpacity>
            <Text>{props.value} </Text>
            <TouchableOpacity onPress={props.onChangeDecrement}>
                <View style={{
                    backgroundColor: "#069044",
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent:"center",
                    width: responsiveWidth(10),
                    height: responsiveHeight(3)
                }}>
                    <Text style={{fontWeight: "bold", color: "white"}}>-</Text>
                </View>
            </TouchableOpacity>
        </View>

    )
}

export default IncrementDecrementComponent;