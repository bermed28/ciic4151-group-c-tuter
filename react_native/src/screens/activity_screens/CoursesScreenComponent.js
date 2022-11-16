import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import NavigationActionButtonComponent from "../../components/NavigationActionButtonComponent";
import axios from "axios";
import {BookingContext} from "../../components/Context";
import {StyleSheet} from "react-native";

function CoursesScreenComponent(props) {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const [courses, setCourses] = useState({});

    const fetchCourses = () => {
        axios.post("http://192.168.86.44:8080/tuter/course-departments",
            {department: bookingData.department},
            {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                const isHiddenCourse = (e) => {
                    return e.course_code.includes("1234")
                    || e.course_code.includes("5678")
                    || e.course_code.includes("2222")
                    || e.course_code.includes("1111");
                }
                const courseData = response.data.filter(e => !isHiddenCourse(e));
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
                                    updateBookingData.course(item.course_code);
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
        <SafeAreaView style={[StyleSheet.absoluteFill, {marginBottom: responsiveHeight(13)}]}>
            <Animatable.View animation={'fadeInUpBig'}>
                <Text style={{
                    marginLeft: responsiveWidth(6),
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 22
                }}>
                    {
                        bookingData.activity !== "Mock Interviews"
                            ? `${bookingData.department} Courses`
                            :  `${bookingData.department} Interviews`
                    }
                </Text>

                {
                    courses.length > 0
                        ? <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: "center"}}>
                            {departmentCourses()}
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
                            }}>There are no available courses for this department at the moment. Please check back later!
                            </Text>
                        </View>
                }
            </Animatable.View>
        </SafeAreaView>
    );
}
export default CoursesScreenComponent;