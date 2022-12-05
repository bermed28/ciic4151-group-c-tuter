import React, {useContext, useEffect, useState} from "react";
import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {responsiveHeight,} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable-unmountable';
import LogoSubtitle from "../../../assets/images/Logo-Subtitle.png";
import Feather from "react-native-vector-icons/Feather";
import ActivityComponent from "../../components/ActivityComponent";
import RecentBookingCardComponent from "../../components/RecentBookingCardComponent";
import {BookingContext} from "../../components/Context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecentBookingModalComponent from "../../components/RecentBookingModalComponent";
import TutorHomeScreenComponent from "./TutorHomeScreenComponent";
import { Dimensions } from "react-native";


function HomeScreenComponent({navigation}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const {bookingData, updateBookingData} = useContext(BookingContext);

    const toggleModal = () => {setOpenModal(!openModal);}
    const win = Dimensions.get('window');

    useEffect(() => {
        async function fetchUser(){
            try {
                await AsyncStorage.getItem("user").then(user => {
                    updateBookingData.userRole(JSON.parse(user).user_role)
                    updateBookingData.user(JSON.parse(user))
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

    return (
        <View>
            <RecentBookingModalComponent visible={openModal} closeModal={toggleModal} session={selected}/>
            {/*Tuter*/}
            <Image source={LogoSubtitle} resizeMode={"contain"} style={{marginBottom: "-2%", marginTop: "11%", marginLeft: "5%", width: win.width/2.1, height: win.width/3.4}}/>

            <Animatable.View duration={600} animation={"fadeInUpBig"}>
                { loggedInUser ?
                    loggedInUser.user_role === "Tutor"
                        ? <TutorHomeScreenComponent navigation={navigation}/>
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

                            <View style={{marginTop: "5%"}}>
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
                                                    ? <Feather name="chevron-up" color={"#666666"} size={24}
                                                               style={{position: "absolute", right: 20}}/>
                                                    : <Feather name="chevron-down" color={"#666666"} size={24}
                                                               style={{position: "absolute", right: 20}}/>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    <Animatable.View
                                        mounted={open}
                                        animation={"fadeInUpBig"}
                                        unmountAnimation={'fadeOutDownBig'}
                                        style={{justifyContent:"center", marginTop: 5}}
                                    >
                                        <FlatList
                                            data={recentBookings}
                                            renderItem={({item}) => (
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => {
                                                        setSelected(item);
                                                        toggleModal();
                                                    }}>
                                                    <RecentBookingCardComponent item={item}/>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) => {return index.toString();}}
                                            style={{height: "64.5%"}}
                                        />
                                    </Animatable.View>
                                </View>
                            </View>
                        </View>
                    : null }
            </Animatable.View>
        </View>
    );
}

export default HomeScreenComponent;