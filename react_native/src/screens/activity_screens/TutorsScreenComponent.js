import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import axios from "axios";
import {BookingContext} from "../../components/Context";
import TutorCardComponent from "../../components/TutorCardComponent";
import SessionBookingModalComponent from "../../components/SessionBookingModalComponent";

function TutorsScreenComponent(props) {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const [tutors, setTutors] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => {setOpenModal(!openModal)};

    const fetchCourses = () => {
        axios.post("https://tuter-app.herokuapp.com/tuter/tutors-by-course/",
            {course_code: bookingData.course},
            {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                const tutors = response.data;
                setTutors(tutors);
            }, (reason) => {console.log(reason)}
        );

    };

    useEffect(() => {
        fetchCourses();
    },[]);

    const renderTutors = () => {
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                {
                    tutors.map((item) => {
                        return (
                            <TutorCardComponent
                                key={item.user_id}
                                label={item.name}
                                courseLabels={item.mastered_courses}
                                labelColor={"#000000"}
                                buttonColor={"#ffffff"}
                                width={responsiveWidth(88)}
                                height={responsiveHeight(10)}
                                margin={responsiveHeight(1)}
                                bold={true}
                                onPress={() => {toggleModal(); updateBookingData.tutor(item)}}
                            />
                        );
                    })
                }
            </View>
        );
    }
    return (
        <SafeAreaView style={[StyleSheet.absoluteFill, {marginBottom: responsiveHeight(13)}]}>
            <SessionBookingModalComponent
                visible={openModal}
                closeModal={toggleModal}
            />

            <Animatable.View animation={'fadeInUpBig'}>
                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 22.0,
                    marginLeft: responsiveWidth(6)
                }}>
                    {bookingData.activity === "Tutoring"
                        ?`${bookingData.course} Tutors`
                        :`${bookingData.department} ${bookingData.faculty} ${
                            bookingData.activity === "Mock Interviews"
                                ? "Interview"
                                : ""
                        } Tutors`
                    }
                </Text>

                {
                    tutors.length > 0
                        ? <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: "center"}}>
                            {renderTutors()}
                        </ScrollView>
                        : <View style={{
                            alignItems: "center",
                            marginLeft: responsiveWidth(5),
                            marginRight: responsiveWidth(5),
                            marginTop: responsiveHeight(30)
                        }}>
                            <Text style={{
                                fontSize: 25.0,
                                fontWeight: "bold",
                                color: "black"
                            }}>There are no available tutors for this course at the moment. Please check back later!
                            </Text>
                        </View>
                }

            </Animatable.View>

        </SafeAreaView>
    );
}
export default TutorsScreenComponent;