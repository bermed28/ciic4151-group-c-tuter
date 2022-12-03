import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable-unmountable'
import {
    responsiveFontSize,
    responsiveHeight,
    responsiveScreenHeight, responsiveScreenWidth,
    responsiveWidth
} from "react-native-responsive-dimensions";

import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RecentBookingCardComponent from "../../components/RecentBookingCardComponent";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import ActivityComponent from "../../components/ActivityComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CourseMastersComponent from "../../components/CourseMastersComponent";

function TutorHomeScreenComponent() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [extraPaddingBottom, setExtraPaddingBottom] = useState(0);
    const [selectedReceipt, setSelectedReceipt] = React.useState(-1);
    const [selectedMaster, setSelectedMaster] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [upcomingSessions, setUpcomingSessions] = React.useState([]);
    const [masters, setMasters] = useState({});

    const toggleModal = () => {setOpenModal(!openModal)}

    useEffect(() => {
        open && upcomingSessions.length > 0
            ? setExtraPaddingBottom(upcomingSessions.length * responsiveHeight(180))
            : setExtraPaddingBottom(0);
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
        async function fetchMasters() {
            try {
                await axios.get(`https://tuter-app.herokuapp.com/tuter/course-masters/info/${loggedInUser.user_id}`)
                    .then((response) => {
                        setMasters(response.data);
                    })
            } catch (e) {
                console.log(e)
            }
        }
        fetchMasters();
    }, [loggedInUser]);


    useEffect( () => {
        async function fetchUpcomingSessions() {
            axios.get(`https://tuter-app.herokuapp.com/tuter/tutor/tutoring-session/${loggedInUser.user_id}`).then(
                (response) => {
                    setUpcomingSessions(response.data);
                }
            ).catch(err => console.log(err));

        }
        fetchUpcomingSessions();
    }, [loggedInUser]);

    return (
        <View>
            <View style={{alignItems: "center", justifyContent: "center", marginBottom: responsiveHeight(3)}}>
                <ActionButtonComponent
                    label={"Select Mastered Courses"}
                    labelColor={"#ffffff"}
                    buttonColor={"#85CB33"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(5.7)}
                    bold={true}/>
            </View>

            <View style={{flexDirection: "row", justifyContent: "center"}}>

                {
                    masteredCourses.length === 0
                        ?
                            <Text style={{fontSize: responsiveFontSize(2.5), fontWeight: "bold"}}>
                                You have no mastered courses!
                            </Text>
                        : null
                }
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <View style={{left: "4%", flexDirection: "row", paddingBottom: 22}}>
                        {
                            masteredCourses[0]
                                ? <CourseMastersComponent
                                    label={masteredCourses[0].course_code}
                                    icon={masteredCourses[0].faculty}
                                    labelColor={"#000000"}
                                    backgroundColor={"#ffffff"}
                                    onPress={() => {
                                        updateBookingData.activity("Mock Interviews");
                                        navigation.navigate("Activity", {screen: "Faculties"})
                                    }}
                                />
                                : null
                        }
                        <View style={{paddingLeft: "5%"}}/>
                        {
                            masteredCourses[1]
                                ? <CourseMastersComponent
                                    label={masteredCourses[1].course_code}
                                    icon={masteredCourses[1].faculty}
                                    labelColor={"#000000"}
                                    backgroundColor={"#ffffff"}
                                    onPress={() => {
                                        updateBookingData.activity("Mock Interviews");
                                        navigation.navigate("Activity", {screen: "Faculties"})
                                    }}
                                />
                                : null
                        }
                    </View>
                    <View style={{left: "4%", flexDirection: "row"}}>
                        {
                            masteredCourses[2]
                                ? <CourseMastersComponent
                                    label={masteredCourses[2].course_code}
                                    icon={masteredCourses[2].faculty}
                                    labelColor={"#000000"}
                                    backgroundColor={"#ffffff"}
                                    onPress={() => {
                                        updateBookingData.activity("Mock Interviews");
                                        navigation.navigate("Activity", {screen: "Faculties"})
                                    }}
                                />
                                : null
                        }
                        <View style={{paddingLeft: "5%"}}/>

                        {
                            masteredCourses[3]
                                ? <CourseMastersComponent
                                    label={masteredCourses[3].course_code}
                                    icon={masteredCourses[3].faculty}
                                    labelColor={"#000000"}
                                    backgroundColor={"#ffffff"}
                                    onPress={() => {
                                        updateBookingData.activity("Mock Interviews");
                                        navigation.navigate("Activity", {screen: "Faculties"})
                                    }}
                                />
                                : null
                        }
                    </View>
                </View>
            </View>

            <View style={{paddingTop: "5%"}}>
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
                            <Text style={{fontSize: 16, color: "#666666"}}>{loggedInUser ? `${loggedInUser.name}'s` : "My"} Upcoming Sessions</Text>
                            {
                                open
                                    ? <Feather name="chevron-down" color={"#666666"} size={24}
                                               style={{position: "absolute", right: 20}}/>
                                    : <Feather name="chevron-up" color={"#666666"} size={24}
                                               style={{position: "absolute", right: 20}}/>
                            }
                        </View>
                    </TouchableOpacity>
                    <ScrollView
                        scrollEnabled={upcomingSessions.length > 0 && open}
                        contentContainerStyle={{flexGrow: 1, paddingBottom: extraPaddingBottom}}
                    >
                        <Animatable.View
                            mounted={open}
                            animation={"fadeInUpBig"}
                            unmountAnimation={'fadeOutDownBig'}
                            style={{
                                position: "absolute",
                                top: responsiveHeight(1)
                            }}>
                            {
                                upcomingSessions.map((item) => {
                                    return (
                                        <TouchableOpacity
                                            key={item.course_id}
                                            activeOpacity={1}
                                            onPress={() => {
                                                setSelectedReceipt(item);
                                                toggleModal();
                                            }}>
                                            <RecentBookingCardComponent item={item}/>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </Animatable.View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const masteredCourses = [
    // {
    //     course_code: "CIIC4020",
    //     course_id: 1,
    //     department: "CIIC",
    //     faculty: "Engineering",
    //     name: "Data Structures"
    // },
    // {
    //     course_code: "MATE3032",
    //     course_id: 1026,
    //     department: "MATE",
    //     faculty: "Arts and Sciences",
    //     name: "Calculus II"
    // },
    // {
    //     course_code: "CITA4305",
    //     course_id: 80,
    //     department: "CIIC",
    //     faculty: "Agricultural Sciences",
    //     name: "Nutrition and Food Technology"
    // },
    // {
    //     course_code: "GERH4019",
    //     course_id: 1454,
    //     department: "GERH",
    //     faculty: "Business Administration",
    //     name: "Compensation Management"
    // }
];

export default TutorHomeScreenComponent;