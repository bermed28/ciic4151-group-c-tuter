import {Text, View} from "react-native";
import React from "react";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import NewProfilePicture from "./UserIconComponent";

function UpcomingSessionCardComponent(props) {

    function renderDate(date) {
        date.setDate(date.getDate() + 1)
        const split = date.toDateString().split(" ")
        return `${split[0]} ${split[1]} ${parseInt(split[2])}, ${split[3]}`
    }

    return (
        <View
            style={{
                flexDirection: "row",
                width: responsiveWidth(92),//390,
                height: responsiveHeight(15),//142,
                borderRadius: 10,
                padding: 20,
                left: "10%",
                marginVertical: 10,
                backgroundColor: "#ffffff",
                alignItems: "center",
            }}>
            <View style={{marginRight: "10%", marginBottom: "5%"}}>
                <NewProfilePicture name={props.item.student_name} size={50} font_size={2} top={"-10%"}/>
            </View>
            <View style={{alignContent: "flex-start"}}>
                <Text style={{padding: 5, fontSize: 20, fontWeight: "bold" }}>{props.item.student_name}</Text>
                <View style={{
                    alignSelf: 'flex-start',
                    marginBottom: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    backgroundColor: "#f2f2f2"
                }}>
                    <Text>{props.item.course_code}</Text>
                </View>
                <Text style={{fontSize: 14}}>{renderDate(new Date(props.item.session_date))}</Text>
            </View>
        </View>
    );
}

export default UpcomingSessionCardComponent;