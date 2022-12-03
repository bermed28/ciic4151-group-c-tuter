import React, {useContext, useEffect, useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
    responsiveFontSize,
    responsiveHeight, responsiveScreenHeight, responsiveScreenWidth,
    responsiveWidth,
    useResponsiveScreenHeight
} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable-unmountable';
import paw from "../../../assets/images/paw.png";
import Feather from "react-native-vector-icons/Feather";
import ActivityComponent from "../../components/ActivityComponent";
import SearchBarComponent from "./SearchBarComponent";
import RecentBookingCardComponent from "../../components/RecentBookingCardComponent";
import {BookingContext} from "../../components/Context";
import ReceiptModal from "../../components/ReceiptModalComponent";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecentBookingModalComponent from "../../components/RecentBookingModalComponent";
import TutorHomeScreenComponent from "./TutorHomeScreenComponent";


function HomeScreenComponent({navigation}) {
    //const [search, setSearch] = useState("");
    const [paddingBottom, setPaddingbottom] = useState(0);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const {bookingData, updateBookingData} = useContext(BookingContext);

    const toggleModal = () => {setOpenModal(!openModal);}

    useEffect(() => {
        async function fetchUser(){
            try {
                await AsyncStorage.getItem("user").then(user => {
                    setLoggedInUser(JSON.parse(user));
                }).catch(err => {
                    console.log(err)
                });
            } catch(e) {
                console.log(e);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        function fetchRecentBookings(user_id) {
            axios.get(`https://tuter-app.herokuapp.com/tuter/recent-bookings/${user_id}`).then(
                (response) => {
                    setRecentBookings(response.data);
                }
            ).catch(err => console.log(err));
        }

        if(loggedInUser)
            fetchRecentBookings(loggedInUser.user_id);


    }, [loggedInUser]);


    useEffect(() => {
            open ? setPaddingbottom(recentBookings.length * responsiveHeight(60)) : setPaddingbottom(0);
        },
        [open]
    );

    return (
        <View>
            {<RecentBookingModalComponent visible={openModal} closeModal={toggleModal} receipt={selected}/>}
            {/*Tuter*/}
            <View style={[styles.title, { marginBottom: responsiveHeight(3), flexDirection: "row" }]}>
                <Text style={styles.tuter}> Tüter </Text>
                {/*paw*/}
                <Image source={paw} style={styles.paw} resizeMode={"contain"} />
                {/*slogan*/}
                <Text style={styles.slogan}> Find a capable tutor, anytime </Text>
            </View>

            <ScrollView
                scrollEnabled={recentBookings.length > 0 && open}
                contentContainerStyle={{flexGrow: 1, paddingBottom: responsiveHeight(90)}}
            >
                {/*Search Bar*/}
                {/*<SearchBarComponent style={styles.actionSearch} onChangeText={(input) => setSearch(input)}/>*/}

                <Animatable.View animation={"fadeInUpBig"}>
                    { loggedInUser ?
                        loggedInUser.user_role === "Tutor"
                            ? <TutorHomeScreenComponent/>
                            : <View>
                                <View style={{flexDirection: "row", justifyContent: "center"}}>
                                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                                        <View style={{left: "4%", flexDirection: "row", paddingBottom: 22}}>
                                            <ActivityComponent
                                                label={"Tutoring"}
                                                iconName={"book"}
                                                labelColor={"#000000"}
                                                backgroundColor={"#ffffff"}
                                                onPress={() => {
                                                    updateBookingData.activity("Tutoring");
                                                    navigation.navigate("Activity", {screen: "Faculties"})
                                                }}
                                            />
                                            <View style={{paddingLeft: "5%"}}/>
                                            <ActivityComponent
                                                label={"Resume Checker"}
                                                iconName={"document"}
                                                labelColor={"#000000"}
                                                backgroundColor={"#ffffff"}
                                                onPress={() => {
                                                    updateBookingData.activity("Resume Checker");
                                                    updateBookingData.faculty("Resume");
                                                    navigation.navigate("Activity", {screen: "Departments"})
                                                }}
                                            />
                                        </View>
                                        <View style={{left: "4%", flexDirection: "row"}}>
                                            <ActivityComponent
                                                label={"Writing Help"}
                                                iconName={"pencil"}
                                                labelColor={"#000000"}
                                                backgroundColor={"#ffffff"}
                                                onPress={() => {
                                                    updateBookingData.activity("Writing Help");
                                                    updateBookingData.faculty("Writing");
                                                    navigation.navigate("Activity", {screen: "Departments"})
                                                }}
                                            />
                                            <View style={{paddingLeft: "5%"}}/>
                                            <ActivityComponent
                                                label={"Mock Interviews"}
                                                iconName={"people"}
                                                labelColor={"#000000"}
                                                backgroundColor={"#ffffff"}
                                                onPress={() => {
                                                    updateBookingData.activity("Mock Interviews");
                                                    navigation.navigate("Activity", {screen: "Faculties"})
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{paddingTop: "10%"}}>
                                    <View>
                                        <TouchableOpacity
                                            style={{
                                                height: responsiveHeight(6.5),
                                                borderRadius: 10,
                                                marginLeft: 17,
                                                marginRight: 16,
                                                backgroundColor: "#ffffff",
                                                paddingLeft: "5%",
                                                justifyContent: "center",
                                            }}
                                            activeOpacity={1}
                                            onPress={() => setOpen(!open)}>

                                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                                <Text style={{fontSize: 16, color: "#666666"}}>Recent Bookings</Text>
                                                {
                                                    open
                                                        ? <Feather name="chevron-down" color={"#666666"} size={24}
                                                                   style={{position: "absolute", right: 20}}/>
                                                        : <Feather name="chevron-up" color={"#666666"} size={24}
                                                                   style={{position: "absolute", right: 20}}/>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <Animatable.View
                                            mounted={open}
                                            animation={"fadeInUpBig"}
                                            unmountAnimation={'fadeOutDownBig'}
                                            style={{
                                                position: "absolute",
                                                top: responsiveHeight(7)
                                            }}>
                                            {
                                                recentBookings.map((item) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={item.session_date}
                                                            activeOpacity={1}
                                                            onPress={() => {
                                                                setSelected(item);
                                                                toggleModal();
                                                            }}>
                                                            <RecentBookingCardComponent item={item}/>
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            }
                                        </Animatable.View>
                                    </View>
                                </View>
                            </View>
                        : null }
                </Animatable.View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    title: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: responsiveScreenHeight(5),
        marginLeft: responsiveScreenWidth(3),
        width: "95%",
        padding: "2%",
    },
    tuter: {
        color: "white",
        fontSize: responsiveFontSize(5),
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 10,
    },
    paw: {
        marginTop: responsiveScreenHeight(-2),
        marginLeft: responsiveScreenWidth(-35),
        height: responsiveScreenHeight(3),
    },
    slogan: {
        color: "white",
        fontSize: responsiveFontSize(1.5),
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 10,
    },
    actionSearch: {
        width: "93%",
        height: 46,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        marginTop: 35,
        borderRadius: 10,
        top: "12%",
        left: 16,
        paddingLeft: 15,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
        shadowColor: "rgba(0,0,0,0.75)"
    },
})
export default HomeScreenComponent;