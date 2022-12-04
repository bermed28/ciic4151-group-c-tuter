import React, {useContext, useEffect, useState} from "react";
import {SafeAreaView, Text, View} from "react-native";
import NavigationActionButtonComponent from "../../components/NavigationActionButtonComponent";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable'
import axios from "axios";
import {BookingContext} from "../../components/Context";

function FacultiesScreenComponent(props) {

    const {bookingData, updateBookingData} = useContext(BookingContext);

    const tutoringOptions = () => {
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                <NavigationActionButtonComponent
                    label={"Arts and Sciences"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {
                        updateBookingData.faculty("Arts and Sciences");
                        props.navigation.navigate("Departments");
                    }}
                />
                <NavigationActionButtonComponent
                    label={"Agricultural Sciences"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {
                        updateBookingData.faculty("Agricultural Sciences");
                        props.navigation.navigate("Departments");
                    }}
                />
                <NavigationActionButtonComponent
                    label={"Business Administration"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {
                        updateBookingData.faculty("Business Administration");
                        props.navigation.navigate("Departments");
                    }}
                />
                <NavigationActionButtonComponent
                    label={"Engineering"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {
                        updateBookingData.faculty("Engineering");
                        props.navigation.navigate("Departments");
                    }}
                />
            </View>
        );

    }

    const mockinterviewOptions = () => {
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                <NavigationActionButtonComponent
                    label={"Behavioral Interview"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {
                        updateBookingData.faculty("Behavioral");
                        props.navigation.navigate("Departments");
                    }}
                />
                <NavigationActionButtonComponent
                    label={"Technical Interview"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {
                        updateBookingData.faculty("Technical");
                        props.navigation.navigate("Departments");
                    }}
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={{paddingTop: responsiveHeight(9)}}>
            <Animatable.View
                animation={'fadeInUpBig'}
                style={{
                    marginLeft: responsiveWidth(6),
                    marginBottom: responsiveHeight(2)
                }}>

                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(3.2),
                }}>
                    {
                        bookingData.activity === "Tutoring" || bookingData.userRole === "Tutor"
                            ? "Faculties"
                            : "Interview Type"
                    }
                </Text>

                <View style={{alignItems: "flex-start"}}>
                    {
                        bookingData.activity === "Tutoring" || bookingData.userRole === "Tutor"
                            ? tutoringOptions()
                            : mockinterviewOptions()
                    }
                </View>
            </Animatable.View>
        </SafeAreaView>
    );
}

export default FacultiesScreenComponent;