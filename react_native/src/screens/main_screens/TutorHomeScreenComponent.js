import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable-unmountable'
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveScreenHeight, responsiveScreenWidth,
    responsiveWidth
} from "react-native-responsive-dimensions";
import ReceiptModal from "../../components/ReceiptModalComponent";
import paw from "../../../assets/images/paw.png";
import Feather from "react-native-vector-icons/Feather";
import ReceiptsCardComponent from "../../components/ReceiptsCardComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RecentBookingCardComponent from "../../components/RecentBookingCardComponent";

function TutorHomeScreenComponent() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [paddingBottom, setPaddingbottom] = useState(0);
    const [selectedReceipt, setSelectedReceipt] = React.useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [upcomingSessions, setUpcomingSessions] = React.useState([]);


    const toggleModal = () => {setOpenModal(!openModal)}
    const toggleDropdown = () => {setOpen(!open)};

    useEffect(() => {
        open ? setPaddingbottom(responsiveHeight(90)) : setPaddingbottom(0);
    }, [open]);

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

    useEffect( () => {
        async function fetchUpcomingSessions() {
            axios.get(`http://192.168.1.9:8080/tuter/tutor/tutoring-session/${loggedInUser.user_id}`).then(
                (response) => {
                    setUpcomingSessions(response.data);
                }
            ).catch(err => console.log(err));

        }
        fetchUpcomingSessions();
    }, [loggedInUser]);

    return (
        <Animatable.View
            animation={"fadeInUpBig"}
            style={{
                justifyContent: "center",
            }}>
            <View>
                {<ReceiptModal visible={openModal} closeModal={toggleModal} receipt={selectedReceipt}/>}
                <Text style={{
                    top: responsiveHeight(1.5),
                    marginLeft: responsiveWidth(5),
                    fontSize: responsiveFontSize(3),
                    fontWeight: "bold",
                    color: "white"
                }}>
                    {loggedInUser ? `${loggedInUser.name}'s` : `My`} Sessions
                </Text>

                <View style={{paddingTop: responsiveHeight(3), paddingBottom: responsiveHeight(1)}}>
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
                        onPress={toggleDropdown}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontSize: 16, color: "#666666" }}>
                                View Receipts
                            </Text>
                            {open ? (
                                <Feather
                                    name="chevron-down"
                                    color={"#666666"}
                                    size={24}
                                    style={{ position: "absolute", right: 20 }}
                                />
                            ) : (
                                <Feather
                                    name="chevron-up"
                                    color={"#666666"}
                                    size={24}
                                    style={{ position: "absolute", right: 20 }}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: paddingBottom}}>
                    {/* View Receipts Cards */}
                    <View>
                        { upcomingSessions.length > 0
                            ? <Animatable.View
                                mounted={open}
                                animation={"fadeInUpBig"}
                                unmountAnimation={'fadeOutDownBig'}
                                style={{
                                    position: "absolute"
                                }}>
                                {
                                    upcomingSessions.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={1}
                                                onPress={() => {
                                                    setSelectedReceipt(item);
                                                    toggleModal();
                                                }}
                                            >
                                                <RecentBookingCardComponent item={item}/>
                                            </TouchableOpacity>
                                        );
                                    })}
                            </Animatable.View>
                            : <View style={{alignItems:"center", justifyContent: "center", paddingTop: responsiveHeight(15)}}>
                                <Text style={{fontWeight: "bold", fontSize: 25}}>You have no upcoming sessions!</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
        </Animatable.View>
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
});

export default TutorHomeScreenComponent;