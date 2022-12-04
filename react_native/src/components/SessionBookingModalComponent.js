import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Alert, Button, Modal, Platform, Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable';
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {BookingContext} from "./Context";
import NewProfilePicture from "./UserIconComponent";
import {useStripe} from "@stripe/stripe-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IncrementDecrementComponent from "./IncrementDecrementComponent";

function SessionBookingModalComponent(props) {
    const {bookingData, updateBookingData} = useContext(BookingContext);
    const [userInfo, setUserInfo] = useState({});

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(true);
    const [hasPayed, setHasPayed] = useState(false);
    const [date, setDate] = useState(new Date()); // date.toISOString().split('T')[0]
    const [time, setTime] = useState(new Date());
    const [duration, setDuration] = useState(1);
    const [location, setLocation] = useState("");
    const [inPerson, setIsInPerson] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);

    const [showTime, setShowTime] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const toggleDatePicker = () => {
        setShowDate(true)
    }
    const toggleTimePicker = () => {
        setShowTime(true)
    }

    const toggleInPerson = () => {
        setIsInPerson(!inPerson)
    }

    const goToHomeScreen = () => {
        props.navigation.navigate("Home");
    }

    React.useEffect(() => {
        setShowDate(false);
    }, [date]);

    React.useEffect(() => {
        console.log(time);
        setShowTime(false);
    }, [time]);

    function getTID(hours, minutes){
        if(minutes === 30) return hours * 2 + 2;
        else return hours * 2 + 1;
    }

    function getTimeSlots() {
        const hour = time.toISOString().split("T")[1].split(":")[0];
        const minute = time.toISOString().split("T")[1].split(":")[1];
        let startTID = getTID(hour, minute);
        let endTID = getTID( parseInt(hour) + parseInt(duration), minute) - 1;
        let timeSlot =[];
        for (let i = startTID; i <= endTID; i++) {
            timeSlot.push(i);
        }

        return timeSlot
    }

    const fetchPaymentSheetParams = async () => {
        const response = await fetch('https://tuter-app.herokuapp.com/payment-sheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({total: bookingData.tutor.hourly_rate * duration})

        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();
        console.log("Modal customer: " + customer);
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async (sessionInfo) => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            customFlow: false,
            merchantDisplayName: 'Stack Overflowers Inc.',
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
        });
        if (!error) {
            setLoading(true);
        }
        await openPaymentSheet(sessionInfo, customer);
    };

    const openPaymentSheet = async (sessionInfo, customer) => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            setHasPayed(true); // The transaction was valid
            props.closeModal();
            bookSession(sessionInfo, customer);
            console.log('Transaction was successful');
        }
    };

    const getTransactionDetails = (reservation, customer) => {
        const errorAlert = (reason) => {
            console.error(reason)
            Alert.alert("Invalid customer_id",
                "Incorrect customer_id not in table",
                [{text: "Okay"}]
            );
        }
        axios.post("https://tuter-app.herokuapp.com/tuter/transaction-details/customer", {customer_id: customer}, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                saveTransaction(response.data[0], reservation);
            }, (reason) => {errorAlert(reason)}
        );
    };

    const saveTransaction = (transDetails, reservation) => {
        console.log("Here are the transaction details");
        console.log(transDetails);
        const errorAlert = (reason) => {
            console.error(reason)
            Alert.alert("Invalid transaction",
                "Error in Transaction details",
                [{text: "Okay"}]
            );
        }
        const transInfo = {
            ref_num: transDetails.ref_num,
            amount: transDetails.amt_captured,
            user_id: userInfo.user_id,
            payment_method: transDetails.card_brand + " ending with: " + transDetails.last_four,
            recipient_id: bookingData.tutor.user_id,
            session_id: reservation.session_id,
        };

        console.log("Inside save transaction");
        console.log(transInfo);

        axios.post("https://tuter-app.herokuapp.com/tuter/transactions/", transInfo, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                console.log(response.data);
                goToHomeScreen();
            }, (reason) => {errorAlert(reason)}
        );
    };

    const checkIfCanBook = () => {
        setLoading(false);
        const sessionInfo = {
            session_date: date.toISOString().split('T')[0],
            is_in_person: inPerson,
            location: location,
            user_id: userInfo.user_id,
            course_id: bookingData.course.courseID,
            members: [bookingData.tutor.user_id],
            time_slots: getTimeSlots(),
        };
        axios.post("https://tuter-app.herokuapp.com/tuter/check/tutoring-sessions",
            sessionInfo,
            {headers: {'Content-Type': 'application/json'}}).then(
            async (response) => {
                const res = response.data;
                console.log("User is available: " + JSON.stringify(res));
                setIsAvailable(res);
                await initializePaymentSheet(sessionInfo); // Had to call it here so payment sheet is loaded after
            }, (reason) => {              // knowing how many hours the tutor will be booked for (hours * hourly_rate)
                !isAvailable              // to correctly calculate price
                    ? Alert.alert('Alert', 'Tutor is not available at this time. Please select another time.')
                    : console.log(reason);
                setLoading(true);
            }
        );
    };

    const bookSession = (sessionInfo, customer) => {
        console.log("Before booking");
        console.log(sessionInfo);
        axios.post("https://tuter-app.herokuapp.com/tuter/tutoring-sessions",
            sessionInfo,
            {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                const res = response.data;
                console.log(JSON.stringify(res));
                getTransactionDetails(res, customer); // Pass on the session id
            }, (reason) => {console.log(reason)}
        );
    };

    const renderTimePicker = () => {
        return (
            <DateTimePicker
                style={{flex: 1, height: 100, marginLeft: 15}}
                value={time}
                mode="time"
                minuteInterval={30}
                onChange={(event, time) => {
                    const offset = time.getTimezoneOffset()
                    const correctedTime = new Date(time.getTime() - (offset * 60 * 1000))
                    setTime(correctedTime)
                }}
            />)};

    useEffect(() => {
        async function fetchUser(){
            try {
                await AsyncStorage.getItem("user").then(user => {
                    console.log(`Fetched User: ${user}`);
                    setUserInfo(JSON.parse(user));
                }).catch(err => {
                    console.log(err)
                });
            } catch(e) {
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
                <Animatable.View animation={"bounceIn"} style={{
                    width: "75%",
                    height: "50%",
                    backgroundColor: "#E5E4E2"
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: responsiveHeight(3),
                        marginBottom: responsiveHeight(1)
                    }}>
                        <View style={{
                            marginLeft: responsiveWidth(3),
                            marginRight: responsiveWidth(12),
                            alignItems: "center"
                        }}>
                            <NewProfilePicture name={bookingData.tutor.name} size={50} font_size={2} top={"-35%"}/>
                        </View>
                        <View style={{marginRight: responsiveWidth(15), alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 16, fontWeight:"bold"}}>{bookingData.tutor.name}</Text>
                            <View style={{backgroundColor: "#D3D3D3", borderRadius: 5, padding: 5}}>
                                <Text style={{fontSize: 10}}>{bookingData.course.courseCode}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{borderColor: "#000000",
                            marginRight: responsiveWidth(10)}} onPress={props.closeModal}>
                            <FontAwesome name="times-circle" size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginLeft: responsiveWidth(3),
                        marginRight: responsiveWidth(3),
                        height: responsiveHeight(25)
                    }}>
                        <Text style={{fontSize: 14, marginBottom: responsiveHeight(0.5)}}> Session Details</Text>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#ffffff",
                            width: "100%",
                            height: responsiveHeight(22),
                            marginRight: responsiveWidth(3),
                            justifyContent:"flex-start"
                        }}>
                            {Platform.OS !== "ios" ? <Button title="Choose date" onPress={toggleDatePicker}/> : null}
                            {showDate || Platform.OS === 'ios' ?
                                <DateTimePicker
                                    style={{flex: 1, backgroundColor: "white", width: 250, height: 100, marginLeft: 15}}
                                    value={date}
                                    mode="date"
                                    dateFormat="longdate"
                                    onChange={(event, date) => {setDate(date);}}
                                />
                                : null}
                            {Platform.OS !== "ios" ? <Button title="Choose time" onPress={toggleTimePicker}/> : null}
                            {Platform.OS === 'ios' ?
                                useMemo(renderTimePicker,[showTime])
                                : showTime ? renderTimePicker() : null
                            }
                            <IncrementDecrementComponent
                                value={duration}
                                onChangeIncrement={() => duration < 3 ? setDuration(duration + 1) : null}
                                onChangeDecrement={() => duration > 1 ? setDuration(duration - 1) : null}
                            />

                        </View>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3),
                        flexDirection: "row",
                        height: 44,
                        marginTop:10,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: "#000000",
                        padding: 5,
                        paddingRight: 5,
                        shadowRadius: 10,
                        shadowOffset: {width: 0, height: 3},
                        shadowColor: "rgba(0,0,0,0.75)"}}>
                        <Text>Location</Text>
                        <TextInput
                            autoCapitalize={'none'}
                            placeholder={"Location"}
                            clearButtonMode={"while-editing"}
                            placeholderTextColor={"rgba(0,0,0,0.45)"}
                            style={{
                                flex: 1,
                                marginTop: Platform.OS === 'ios' ? 0 : -12,
                                paddingLeft: 10,
                                color: "#05375a"
                            }}
                            onChangeText={(location) => {setLocation(location);}}
                        />
                    </View>
                    <View style={{marginLeft: responsiveWidth(3)}}>
                        <Text>In Person?</Text>
                        <Switch
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleInPerson}
                            value={inPerson}
                        />
                    </View>

                    <View style={{alignItems: "center"}}>
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

                            }} onPress={checkIfCanBook}>
                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 16
                                }}>Book Session</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    );

}

export default SessionBookingModalComponent;