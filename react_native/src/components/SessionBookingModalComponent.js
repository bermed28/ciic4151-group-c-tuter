import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, Modal, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable';
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {BookingContext} from "./Context";
import {useStripe} from "@stripe/stripe-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import IncrementDecrementComponent from "./IncrementDecrementComponent";

function SessionBookingModalComponent(props) {
    const {bookingData, updateBookingData} = useContext(BookingContext);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [isValid, setValid] = useState(false);
    const [date, setDate] = useState(new Date()); // date.toISOString().split('T')[0]
    const [time, setTime] = useState(new Date());
    const [duration, setDuration] = useState(0);

    const [showTime, setShowTime] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const toggleDatePicker = () => {
        setShowDate(true)
    }
    const toggleTimePicker = () => {
        setShowTime(true)
    }

    React.useEffect(() => {
        setShowDate(false);
    }, [date]);

    React.useEffect(() => {
        console.log(time);
        setShowTime(false);
    }, [time]);


    const fetchPaymentSheetParams = async () => {
        const response = await fetch('https://tuter-app.herokuapp.com/payment-sheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
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
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            setValid(true); // The transaction was valid
            console.log('Transaction was successful');
        }
    };

    useEffect(() => {
        initializePaymentSheet().then(r => {});
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
                            <FontAwesome
                                name="circle"
                                color={"#000000"}
                                size={50}
                            />
                        </View>
                        <View style={{marginRight: responsiveWidth(15), alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 16, fontWeight:"bold"}}>{bookingData.tutor.name}</Text>
                            <View style={{backgroundColor: "#D3D3D3", borderRadius: 5, padding: 5}}>
                                <Text style={{fontSize: 10}}>{bookingData.course}</Text>
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
                            {showTime || Platform.OS === 'ios' ?
                                <DateTimePicker
                                    style={{flex: 1, height: 100, marginLeft: 15}}
                                    value={time}
                                    mode="time"
                                    minuteInterval={30}
                                    onChange={(event, time) => {const offset = time.getTimezoneOffset()
                                        const correctedTime = new Date(time.getTime() - (offset * 60 * 1000))
                                        setTime(correctedTime)}}
                                /> : null}
                            <IncrementDecrementComponent
                                value={duration}
                                onChangeIncrement={() => duration < 3 ? setDuration(duration + 1) : null}
                                onChangeDecrement={() => duration > 0 ? setDuration(duration - 1) : null}
                            />

                        </View>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3)}}>
                        <Text>Location</Text>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3)}}>
                        <Text>Platform</Text>
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

                            }} onPress={openPaymentSheet}>
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