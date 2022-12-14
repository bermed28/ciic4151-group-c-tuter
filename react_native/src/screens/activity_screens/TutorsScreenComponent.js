import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import axios from "axios";
import {BookingContext} from "../../components/Context";
import TutorCardComponent from "../../components/TutorCardComponent";
import SessionBookingModalComponent from "../../components/SessionBookingModalComponent";
import {StripeProvider} from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TutorsScreenComponent(props) {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const [tutors, setTutors] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null)

    const toggleModal = () => {setOpenModal(!openModal)};


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

        async function fetchCourses() {
            axios.post("https://tuter-app.herokuapp.com/tuter/tutors-by-course/",
                {course_code: bookingData.course.courseCode, user_id: loggedInUser.user_id},
                {headers: {'Content-Type': 'application/json'}}).then(
                (response) => {
                    const tutors = response.data;
                    setTutors(tutors);
                }, (reason) => {console.log(reason)}
            );

        }
        fetchCourses();
    },[loggedInUser]);

    const renderTutors = () => {
        return (
            <View style={{flex: 1, alignItems: "center"}}>
                {
                    tutors.map((item) => {
                        console.log(item)
                        return (
                            <TutorCardComponent
                                key={item.user_id}
                                label={item.name}
                                courseLabels={item.mastered_courses}
                                department={item.department}
                                hourlyRate={item.hourly_rate}
                                rating={item.user_rating}
                                labelColor={"#000000"}
                                buttonColor={"#ffffff"}
                                width={responsiveWidth(88)}
                                height={responsiveHeight(15)}
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
        <SafeAreaView style={[StyleSheet.absoluteFill, {paddingTop: responsiveHeight(9), marginBottom: responsiveHeight(13)}]}>
            <StripeProvider
                publishableKey= "pk_test_51M2zHJDhRypYPdkQRZ4Cd7KIu3idER1Fz9Je6KWv7xKDdG2OENqBADizHpdPUtGX1jrEtdKvTuYJSUIeNkoKIoeM00UiSHJiq2"

                urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
                merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
            >
                <SessionBookingModalComponent
                    visible={openModal}
                    closeModal={toggleModal}
                    navigation={props.navigation}
                />
            </StripeProvider>

            <Animatable.View duration={600} animation={'fadeInUpBig'}>
                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 22.0,
                    marginLeft: responsiveWidth(6)
                }}>
                    {bookingData.activity === "Tutoring"
                        ?`${bookingData.course.courseCode} Tutors`
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