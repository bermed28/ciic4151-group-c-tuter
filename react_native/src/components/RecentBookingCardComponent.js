import {Text, View} from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";

function RecentBookingCardComponent(props) {
    return (
        <View
            style={{
                flexDirection: "row",
                width: responsiveWidth(92),//390,
                height: responsiveHeight(17),//142,
                borderRadius: 10,
                padding: 20,
                left: "10%",
                marginVertical: 10,
                backgroundColor: "#ffffff"
            }}>
            <View style={{left: 0, marginRight: 10}}>
                <Feather name={"circle"} size={45}/>
            </View>
            <View>
                <Text style={{padding: 5 , fontSize: 20, fontWeight: "bold" }}>{props.item.name}</Text>
                <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: 10, paddingLeft: 5}}>
                    <Text style={{bottom: 5, color: "#666666"}}>{props.item.major}</Text>
                    <View style={{alignSelf: 'flex-start', marginTop: 5,  paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, backgroundColor: "#f2f2f2"}}>
                        <Text>{props.item.course}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default RecentBookingCardComponent