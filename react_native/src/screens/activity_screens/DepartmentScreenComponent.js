import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
                                    props.navigation.navigate("Courses")
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
                        ? `${bookingData.faculty} Departments`
                        : bookingData.activity === "Mock Interviews"
                            ? bookingData.faculty
                            : " "
                    }
                </Text>

                <ScrollView
                    contentContainerStyle={{alignItems: "flex-start"}}
                    style={{flexGrow: 1, height: "100%"}}
                >
                    {tutoringDepartments()}
                </ScrollView>
            </Animatable.View>

        </SafeAreaView>
    );
}
export default DepartmentScreenComponent;