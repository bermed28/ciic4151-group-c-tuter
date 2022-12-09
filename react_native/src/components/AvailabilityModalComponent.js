import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Button,
    Modal,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as Animatable from 'react-native-animatable';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {BookingContext} from "./Context";
import NewProfilePicture from "./UserIconComponent";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IncrementDecrementComponent from "./IncrementDecrementComponent";


function AvailabilityModalComponent(props) {
    const {bookingData, updateBookingData} = useContext(BookingContext);
    const [userInfo, setUserInfo] = useState({});

    const [loading, setLoading] = useState(true);

    const [date, setDate] = useState(new Date()); // date.toISOString().split('T')[0]
    const [time, setTime] = useState(new Date());
    const [duration, setDuration] = useState(1);

    const [showTime, setShowTime] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const toggleDatePicker = () => {setShowDate(true)}
    const toggleTimePicker = () => {setShowTime(true)}
    const goToHomeScreen = () => {props.navigation.navigate("Home");}

    useEffect(() => {setShowDate(false);}, [date]);
    useEffect(() => {setShowTime(false);}, [time]);

    function getTID(hours, minutes) {
        if (minutes === 30) return hours * 2 + 2;
        else return hours * 2 + 1;
    }

    function getTimeSlots() {
        const hour = time.toTimeString().split(" ")[0].split(":")[0];
        const minute = time.toTimeString().split(" ")[0].split(":")[1];
        let startTID = getTID(parseInt(hour), parseInt(minute));
        let endTID = getTID(parseInt(hour) + parseInt(duration), parseInt(minute)) - 1;
        let timeSlot = [];
        for (let i = startTID; i <= endTID; i++) {
            timeSlot.push(i);
        }
        return timeSlot
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

    const formatDate = (date) => {
        let newDate = "";
        console.log(date.toISOString());
        if(date){
            if(Platform.OS === 'ios'){
                const split = date.toLocaleString().split(" ")[0].split("/");
                const year = split[2].substring(0, split[2].length - 1);
                const month = split[0];
                const day = parseInt(split[1]) < 9 ? `0${split[1]}` : split[1];
                newDate = `${year}-${month}-${day}`;
            }
            else{
                newDate = date.toISOString().split("T")[0]
            }
        }

        return newDate;
    }


    const markUnavailable = () => {
        setLoading(false);
        const sessionInfo = {
            us_day: formatDate(date),
            user_id: userInfo.user_id,
            ts_id: getTimeSlots(),
        };
        console.log(`SESSION INFO: ${JSON.stringify(sessionInfo)}`);
        axios.post("http://192.168.1.6:8080/tuter/user-schedule/markunavailable",
            sessionInfo,
            {headers: {'Content-Type': 'application/json'}}).then(
            async (response) => {
                const res = response.data;
            }, (reason) => {
                !true
                    ? Alert.alert('Alert', 'Tutor is not available at this time. Please select another time.')
                    : console.log(reason);
                setLoading(true);
            }
        );
    };


    const renderTimePicker = () => {
        return (
            <View style={{flexDirection: "row", height: responsiveHeight(6)}}>
                <Text style={styles.text_footer}>  Time:</Text>
                <DateTimePicker
                    style={{flex: 1, marginLeft: 15, right: 10}}
                    value={time}
                    mode="time"
                    display={"default"}
                    minuteInterval={30}
                    onChange={(event, time) => {
                        const {type, nativeEvent: {timestamp}} = event;
                        if(type === "set"){
                            //console.log("setting time " + time)
                            // const offset = time.getTimezoneOffset()
                            // const correctedTime = new Date(time.getTime() - (offset * 60 * 1000))
                            setTime(time)
                        }
                    }}
                />
            </View>)
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                await AsyncStorage.getItem("user").then(user => {
                    console.log(`Fetched User: ${user}`);
                    setUserInfo(JSON.parse(user));
                }).catch(err => {
                    console.log(err)
                });
            } catch (e) {
                console.log(e);
            }
        }

        fetchUser();
    }, []);

    return (
        <Modal transparent visible={props.visible}>
            <View style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Animatable.View duration={600} animation={"bounceIn"} style={{
                    width: "80%",
                    height: Platform.OS === 'ios' ? "55%" : "62%",
                    backgroundColor: "#f2f2f7",
                    borderRadius: 10,
                    paddingBottom: "15%"
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between", //"flex-end",
                        marginTop: responsiveHeight(3),
                        marginBottom: responsiveHeight(1)
                    }}>
                        <View style={{
                            marginRight: responsiveWidth(14),
                            marginLeft: responsiveWidth(3),
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>Select unavailable time:</Text>
                            {/*<View style={{backgroundColor: "#D3D3D3", borderRadius: 5, padding: 5}}>*/}
                            {/*    <Text style={{fontSize: 10}}>Testing1234</Text>*/}
                            {/*</View>*/}
                        </View>
                        <TouchableOpacity style={{
                            borderColor: "#000000",
                            marginRight: responsiveWidth(10)
                        }} onPress={props.closeModal}>
                            <FontAwesome name="times-circle" size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginLeft: responsiveWidth(3),
                        marginRight: responsiveWidth(3),
                        height: responsiveHeight(21)
                    }}>
                        <Text style={[styles.text_footer, {fontSize: 14, marginBottom: responsiveHeight(0.5)}]}> Select:</Text>
                        <View style={{
                            // flex: 1,
                            backgroundColor: "#ffffff",
                            width: "100%",
                            height: responsiveHeight(18),
                            marginRight: responsiveWidth(3),
                            justifyContent: "flex-start",
                            borderRadius: 10
                        }}>

                            {Platform.OS !== "ios" ? <Button title="Choose date" onPress={toggleDatePicker}/> : null}
                            {showDate || Platform.OS === 'ios' ?
                                <View style={{flexDirection: "row", height: responsiveHeight(6)}}>
                                    <Text style={styles.text_footer}>  Date:</Text>
                                    <DateTimePicker
                                        style={{flex: 1, marginLeft: 15, right: 10}}
                                        value={date}
                                        mode="date"
                                        dateFormat="longdate"
                                        onChange={(event, date) => {
                                            setDate(date);
                                        }}
                                    />
                                </View>
                                : null}
                            <View
                                style={{
                                    borderBottomColor: "black",
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            {Platform.OS !== "ios" ? <Button title="Choose time" onPress={toggleTimePicker}/> : null}
                            {Platform.OS === 'ios' ?
                                useMemo(renderTimePicker, [showTime])
                                : showTime ? renderTimePicker() : null
                            }
                            <View
                                style={{
                                    borderBottomColor: "black",
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{flexDirection: "row", height: responsiveHeight(6)}}>
                                <Text style={styles.text_footer}>  Duration:</Text>
                                <IncrementDecrementComponent
                                    value={duration}
                                    units={" hrs."}
                                    onChangeDecrement={() => duration > 1 ? setDuration(duration - 0.5) : null}
                                    onChangeIncrement={() => duration < 8 ? setDuration(duration + 0.5) : null}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems: "center", top: "6%"}}>
                        <TouchableOpacity
                            disabled={!loading}
                            style={{
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: responsiveWidth(3),
                                width: responsiveWidth(65),
                                height: responsiveHeight(5),
                                backgroundColor: "#069044"

                            }} onPress={markUnavailable}>
                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}>Mark Unavailable</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    text_footer: {
        color: "#05375a",
        // fontSize: responsiveFontSize(2.1)
    },
});

export default AvailabilityModalComponent;