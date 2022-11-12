import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import NavigationActionButtonComponent from "../../components/NavigationActionButtonComponent";
import axios from "axios";
import {BookingContext} from "../../components/Context";

function TutorsScreenComponent(props) {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const [courses, setCourses] = useState({});

    const fetchCourses = () => {
        axios.post("http://192.168.0.21:8080/tuter/tutors-by-course/",
            {course_code: bookingData.course},
            {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                const courseData = response.data;
                setCourses(courseData);
            }, (reason) => {console.log(reason)}
        );

    };

    useEffect(() => {
        fetchCourses();
    },[]);

    const departmentCourses = () => {
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                {
                    courses.length > 0 ? courses.map((item) => {
                        return (
                            <NavigationActionButtonComponent
                                key={item.course_id}
                                label={item.course_code + " - " + item.name}
                                labelColor={"#000000"}
                                buttonColor={"#ffffff"}
                                width={responsiveWidth(88)}
                                height={responsiveHeight(6)}
                                margin={responsiveHeight(1)}
                                bold={true}
                                onPress={() => {
                                    props.navigation.navigate("Tutors");
                                }}
                            />
                        );
                    }) : console.log("Empty")
                }

            </View>
        );
    }
    return (
        <SafeAreaView style={{paddingTop: responsiveHeight(6)}}>
            <Animatable.View animation={'fadeInUpBig'}
                             style={{marginLeft: responsiveWidth(6), marginBottom: responsiveHeight(2)}}>
                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 22
                }}>
                    {
                        bookingData.activity === "Tutoring"
                            ? `${bookingData.department} Courses`
                            : bookingData.activity === "Mock Interviews"
                                ? `${bookingData.department} Interviews`
                                : ""
                    }
                </Text>

                <ScrollView
                    contentContainerStyle={{alignItems: "flex-start"}}
                    style={{flexGrow: 1, height: "100%"}}
                >
                    {departmentCourses()}
                </ScrollView>
            </Animatable.View>

        </SafeAreaView>
    );
}
export default TutorsScreenComponent;