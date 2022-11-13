import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import NavigationActionButtonComponent from "../../components/NavigationActionButtonComponent";
import axios from "axios";
import {BookingContext} from "../../components/Context";

function DepartmentScreenComponent(props) {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const [departments, setDepartments] = useState({});

    const fetchDepartments = () => {
        axios.post("http://192.168.0.21:8080/tuter/depts-by-faculty",
            {faculty: bookingData.faculty},
            {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                const deptData = response.data.departments;
                setDepartments(deptData);
            }, (reason) => {console.log(reason)}
        );

    };

    useEffect(() => {
        fetchDepartments();
    },[]);

    const tutoringDepartments = () => {
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                {
                    departments.length > 0 ? departments.map((item) => {
                        return (
                            <NavigationActionButtonComponent
                                key={item}
                                label={item}
                                labelColor={"#000000"}
                                buttonColor={"#ffffff"}
                                width={responsiveWidth(88)}
                                height={responsiveHeight(6)}
                                margin={responsiveHeight(1)}
                                bold={true}
                                onPress={() => {
                                    updateBookingData.department(item);
                                    const course = item + (
                                        bookingData.faculty === "Behavioral"
                                            ? "1234"
                                            : bookingData.faculty === "Technical"
                                                ? "5678"
                                                : bookingData.faculty === "Resume"
                                                    ? "2222"
                                                    : bookingData.faculty === "Writing"
                                                        ? "1111" : ""
                                    );
                                    if(bookingData.activity === "Mock Interviews"
                                        || bookingData.activity === "Resume Checker"){
                                        updateBookingData.course(course);
                                        props.navigation.navigate("Tutors");
                                    } else
                                        props.navigation.navigate("Courses");
                                }}
                            />
                        );
                    }) : console.log("Empty")
                }

            </View>
        );
    }
    return (
        <SafeAreaView style={[StyleSheet.absoluteFill, {marginBottom: responsiveHeight(13)}]}>
            <Animatable.View animation={'fadeInUpBig'}>
                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 22,
                    marginLeft: responsiveWidth(6)
                }}>
                    {
                        bookingData.activity === "Tutoring"
                            ? `${bookingData.faculty} Departments`
                            : bookingData.activity === "Mock Interviews"
                                ? `${bookingData.faculty} Interviews`
                                : "Categories"
                    }
                </Text>

                {
                    departments.length > 0
                        ? <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: "center"}}>
                            {tutoringDepartments()}
                        </ScrollView>
                        : <View style={{
                            alignItems: "center",
                            marginLeft: responsiveWidth(5),
                            marginRight: responsiveWidth(5),
                            marginTop: responsiveHeight(30)
                        }}>
                            <Text style={{
                                fontSize: 25,
                                fontWeight: "bold",
                                color: "black"
                            }}>There are no available departments for this faculty at the moment. Please check back later!
                            </Text>
                        </View>
                }
            </Animatable.View>

        </SafeAreaView>
    );
}
export default DepartmentScreenComponent;