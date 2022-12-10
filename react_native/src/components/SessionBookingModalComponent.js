import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
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
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {BookingContext} from "./Context";
import NewProfilePicture from "./UserIconComponent";
import {useStripe} from "@stripe/stripe-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IncrementDecrementComponent from "./IncrementDecrementComponent";
import * as Notifications from 'expo-notifications';
import * as Device from "expo-device";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


function SessionBookingModalComponent(props) {
    const {bookingData, updateBookingData} = useContext(BookingContext);
    const [userInfo, setUserInfo] = useState({});

    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [loading, setLoading] = useState(true);
    const [hasPayed, setHasPayed] = useState(false);
    const [date, setDate] = useState(new Date()); // date.toISOString().split('T')[0]
    const [time, setTime] = useState(new Date());
    const [duration, setDuration] = useState(1);
    const [location, setLocation] = useState("");
    const [inPerson, setIsInPerson] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [booked, setBooked] = useState(false);

    const [showTime, setShowTime] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const toggleDatePicker = () => {setShowDate(true)}
    const toggleTimePicker = () => {setShowTime(true)}
    const toggleInPerson = () => {setIsInPerson(!inPerson)}
    const goToHomeScreen = () => {props.navigation.navigate("Home");}

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    useEffect(() => {setShowDate(false);}, [date]);
    useEffect(() => {setShowTime(false);}, [time]);

    async function scheduleStudentPushNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Session Booked",
                body: `You have booked a session with ${bookingData.tutor.name} for ${bookingData.course.courseCode}!\n\nContact your tutor at ${bookingData.tutor.email}`,
            },
            trigger: { seconds: 2 },
        });
    }

    const sendNotification = async () => {await scheduleStudentPushNotification();}


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

    const fetchPaymentSheetParams = async () => {
        const response = await fetch('https://tuter-app.herokuapp.com/payment-sheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({total: bookingData.tutor.hourly_rate * duration})

        });

        const {paymentIntent, ephemeralKey, customer} = await response.json();
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

        const {error} = await initPaymentSheet({
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
        const {error} = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            setHasPayed(true); // The transaction was valid
            props.closeModal();
            bookSession(sessionInfo, customer);
            console.log('Transaction was successful');
            sendNotification().then(r => console.log(r));
            setBooked(true);
        }
    };

    const getTransactionDetails = (reservation, customer) => {
        const errorAlert = (reason) => {
            Alert.alert("Invalid customer_id",
                "Incorrect customer_id not in table",
                [{text: "Okay"}]
            );
        }
        axios.post("https://tuter-app.herokuapp.com/tuter/transaction-details/customer", {customer_id: customer}, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                saveTransaction(response.data[0], reservation);
            }, (reason) => {
                errorAlert(reason)
            }
        );
    };

    const saveTransaction = (transDetails, reservation) => {
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

        axios.post("https://tuter-app.herokuapp.com/tuter/transactions/", transInfo, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                goToHomeScreen();
            }, (reason) => {
                errorAlert(reason)
            }
        );
    };

    const checkIfCanBook = () => {
        setLoading(false);
        const sessionInfo = {
            session_date: formatDate(date),
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
        axios.post("https://tuter-app.herokuapp.com/tuter/tutoring-sessions",
            sessionInfo,
            {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                const res = response.data;
                getTransactionDetails(res, customer); // Pass on the session id
            }, (reason) => {
                console.log(reason)
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
                        <View style={{
                            marginRight: responsiveWidth(15),
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{bookingData.tutor.name}</Text>
                            <View style={{backgroundColor: "#D3D3D3", borderRadius: 5, padding: 5}}>
                                <Text style={{fontSize: 10}}>{bookingData.course.courseCode}</Text>
                            </View>
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
                        <Text style={[styles.text_footer, {fontSize: 14, marginBottom: responsiveHeight(0.5)}]}> Session
                            Details</Text>
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
                                    onChangeIncrement={() => duration < 3 ? setDuration(duration + 0.5) : null}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3), top: "1%"}}>
                        <Text style={styles.text_footer}> Location</Text>
                        <View style={{
                            marginLeft: "3%",
                            marginRight: "4%",
                            flexDirection: "row",
                            height: 44,
                            marginTop: 5,
                            borderRadius: 10,
                            borderWidth: 1.5,
                            borderColor: "#000000",
                            padding: 5,
                            paddingRight: 5,
                            shadowRadius: 10,
                            shadowOffset: {width: 0, height: 3},
                            shadowColor: "rgba(0,0,0,0.75)"
                        }}>
                            <TextInput
                                autoCapitalize={'words'}
                                placeholder={"Location"}
                                clearButtonMode={"while-editing"}
                                placeholderTextColor={"rgba(0,0,0,0.45)"}
                                style={{
                                    flex: 1,
                                    marginTop: Platform.OS === 'ios' ? 0 : -12,
                                    paddingLeft: 10,
                                    color: "#05375a",
                                    // backgroundColor: "white"
                                }}
                                onChangeText={(location) => {
                                    setLocation(location);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3), top: "2%", paddingBottom: "2%"}}>
                        <Text style={styles.text_footer}> In Person?</Text>
                        <Switch
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleInPerson}
                            value={inPerson}
                            style={{marginLeft: 10, top: 1}}
                        />
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

const styles = StyleSheet.create({
    text_footer: {
        color: "#05375a",
        // fontSize: responsiveFontSize(2.1)
    },
});

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export default SessionBookingModalComponent;