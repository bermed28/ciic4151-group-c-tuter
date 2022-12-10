import React from 'react';
import {Alert, Modal, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable';
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import ActionButtonComponent from "./ActionButtonComponent";

function UpcomingSessionModalComponent(props) {

    const handleSessionCancellation = () => {
        Alert.alert("Session Cancellation",
            `Are you sure you want to cancel your ${props.session.course_code} with ${props.session.student_name}?`,
            [
                {
                    text: "Yes",
                    onPress: () => {
                        axios.delete(`https://tuter-app.herokuapp.com/tuter/tutoring-session/${props.session.session_id}`,
                            {headers: {'Content-Type': 'application/json'},}).then(
                            (response) => {
                                console.log("entramos")
                                Alert.alert("Success",`Session has been cancelled & removed from your schedule`);
                                props.refresh();
                                props.closeModal();
                            }
                        ).catch((error) => {Alert.alert(`Cannot Remove ${props.master.course_code} Master`, error.message)});
                    },
                    style: "cancel"
                },
                { text: "No", onPress: () => console.log("Session was not cancelled") }
            ]);
    }

    const formatDate = () => {
        if(props.session.session_date) {

            const dateSplit = String(props.session.session_date).split("-");
            const year = parseInt(dateSplit[0]);
            const month = parseInt(dateSplit[1]) - 1;
            const day = parseInt(dateSplit[2]);

            const timeSplit = props.session.start_time.split(":");
            const hours = parseInt(timeSplit[0]) % 12 === 0 ? 12 : parseInt(timeSplit[0]) % 12
            const minutes = parseInt(timeSplit[1]) === 0 ? "00" : timeSplit[1];
            const seconds = parseInt(timeSplit[2]) === 0 ? "00" : timeSplit[2];

            let date = new Date(
                year,
                month,
                day,
                hours,
                minutes,
                seconds
            );
            return date.toDateString();
        }
    }

    const formatTime = (time) => {
        if(time) {
            const split = time.split(":");
            const hours = parseInt(split[0]) % 12 === 0 ? 12 : parseInt(split[0]) % 12
            const minutes = parseInt(split[1]) === 0 ? "00" : split[1];
            const amPM = parseInt(split[0]) <= 11 ? "AM" : "PM"

            return `${hours}:${minutes} ${amPM}`;
        }
        return "";
    }

    const getTimeDuration = () => {
        let result = "";
        if(props.session.start_time && props.session.end_time) {
            const dateSplit = String(props.session.session_date).split("-");
            const year = parseInt(dateSplit[0]);
            const month = parseInt(dateSplit[1]) - 1;
            const day = parseInt(dateSplit[2]) - 1;

            const startSplit = props.session.start_time .split(":");
            const endSplit = props.session.end_time .split(":");

            let startDate = new Date(
                year,
                month,
                day,
                parseInt(startSplit[0]),
                parseInt(startSplit[1]),
                parseInt(startSplit[2])
            );

            let endDate = new Date(
                year,
                month,
                day,
                parseInt(endSplit[0]),
                parseInt(endSplit[1]),
                parseInt(endSplit[2])
            );

            let difference = endDate.getTime() - startDate.getTime();

            if (difference >= 0) {
                difference = difference / 1000;
                let hourDifference = Math.floor(difference / 3600);
                difference -= hourDifference * 3600;
                let minuteDifference = Math.floor(difference / 60);
                difference -= minuteDifference * 60;

                result = hourDifference > 0 && minuteDifference > 0
                    ? hourDifference === 1
                        ? `${hourDifference} hour & ${minuteDifference} minutes`
                        : `${hourDifference} hours & ${minuteDifference} minutes`
                    : hourDifference === 0 && minuteDifference > 0
                        ? `${minuteDifference} minutes`
                        : hourDifference === 1
                            ? `${hourDifference} hour`
                            : `${hourDifference} hours` ;
            }
            return result;
        }
    }

    return (
        <Modal transparent visible={props.visible}>
            <View style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Animatable.View duration={600} animation={"bounceIn"} style={{
                    width: "75%",
                    height: "38%",
                    backgroundColor: "white",
                    borderRadius: 10
                }}>
                    <View style={{
                        width: "100%",
                        height: "20%",
                        flexDirection: "row",
                        justifyContent:"space-between",
                        marginRight: responsiveWidth(5)

                    }}>
                        <View style={{flexDirection: "row-reverse", paddingTop: "2%", paddingRight: "20%", alignItems: "center"}}>
                            <View style={{
                                height: "70%",
                                marginBottom: 5,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                                backgroundColor: "#f2f2f2"
                            }}>
                                <Text style={{fontWeight: "bold", fontSize: 20}}>{props.session.student_name}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", paddingRight: "5%", alignItems: "center"}}>
                            <TouchableOpacity onPress={props.closeModal}>
                                <FontAwesome name="times-circle" size={35}/>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{borderColor: "black", height: "75%"}}>
                        <View style={{alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{justifyContent: "flex-start"}}>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveHeight(1)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Course: {props.session.course_code}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveHeight(1)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Department: {props.session.department}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveWidth(1)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Session Date: {formatDate(props.session.session_date)}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveWidth(1)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Session Time: {formatTime(props.session.start_time)}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveWidth(1)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Session Duration: {getTimeDuration()}
                                    </Text>
                                </View>

                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveWidth(1)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Location: {props.session.location}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{alignItems: "center", marginTop: "5%"}}>
                            { new Date().getTime() - new Date(formatDate(props.session.session_date)) < 0  ?
                            <ActionButtonComponent
                                label={"Cancel Session"}
                                labelColor={"#ffffff"}
                                buttonColor={props.selectingCourse ? "#85CB33" : "red"}
                                width={"75%"}
                                height={"45%"}
                                bold={true}
                                onPress={() => handleSessionCancellation()}
                            />
                            : <ActionButtonComponent
                                label={"Unable to Cancel Session"}
                                labelColor={"#ffffff"}
                                buttonColor={props.selectingCourse ? "#85CB33" : "gray"}
                                width={"75%"}
                                height={"45%"}
                                bold={true}
                            />}
                        </View>
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    );

}

export default UpcomingSessionModalComponent;