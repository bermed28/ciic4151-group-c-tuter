import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import NavigationActionButtonComponent from "../../components/NavigationActionButtonComponent";
import axios from "axios";
import {BookingContext} from "../../components/Context";
import {StyleSheet} from "react-native";
import CourseMasterModalComponent from "../../components/CourseMasterModalComponent";

function CoursesScreenComponent(props) {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const [courses, setCourses] = useState({});
    const [selectedCourse, setSelectedCourse]= useState({});
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => {setOpenModal(!openModal)};
    const fetchCourses = () => {
        axios.post("https://tuter-app.herokuapp.com/tuter/course-departments",
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
                                    if(bookingData.userRole === "Tutor"){
                                        setSelectedCourse({
                                            courseCode: item.course_code,
                                            courseName: item.name,
                                            courseID: item.course_id
                                        })
                                        toggleModal();
                                    } else {
                                        updateBookingData.course({
                                            courseCode: item.course_code,
                                            courseID: item.course_id
                                        });
                                        props.navigation.navigate("Tutors");
                                    }
                                }}
                            />
                        );
                    }) : console.log("Empty")
                }

            </View>
        );
    }

    return (
        <SafeAreaView style={[StyleSheet.absoluteFill, {paddingTop: responsiveHeight(9), marginBottom: responsiveHeight(13)}]}>
            <CourseMasterModalComponent
                visible={openModal}
                closeModal={toggleModal}
                master={{
                    course_code: selectedCourse.courseCode,
                    department: bookingData.department,
                    faculty: bookingData.faculty,
                    name: selectedCourse.courseName,
                    course_id: selectedCourse.courseID
                }}
                selectingCourse={true}
                navigation={props.navigation}
            />
            <Animatable.View animation={'fadeInUpBig'}>
                <Text style={{
                    marginLeft: responsiveWidth(6),
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2.9)
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