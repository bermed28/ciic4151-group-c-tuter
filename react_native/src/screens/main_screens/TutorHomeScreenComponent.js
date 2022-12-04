import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable-unmountable'
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import CourseMastersComponent from "../../components/CourseMastersComponent";
import CourseMasterModalComponent from "../../components/CourseMasterModalComponent";
import UpcomingSessionCardComponent from "../../components/UpcomingSessionCardComponent";
import UpcoingSessionModalComponent from "../../components/UpcoingSessionModalComponent";

function TutorHomeScreenComponent(props) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [activeReload, setActiveReload] = useState(false);
    const [sessionReload, setSessionReload] = useState(false);
    const [selectedSession, setSelectedSession] = useState({})
    const [selectedMaster, setSelectedMaster] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openMasterModal, setOpenMasterModal] = useState(false);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [masters, setMasters] = useState({});

    const toggleModal = () => {setOpenModal(!openModal)}
    const toggleMasterModal = () => {setOpenMasterModal(!openMasterModal)}
    const toggleActiveReload = () => {setActiveReload(!activeReload)}
    const toggleSessionReload = () => {setSessionReload(!sessionReload)}

    const setScrollViewHeight = (length) => {
        const isEmpty = length === 0
        const oneRow = length <= 2;
        return (
            isEmpty
                ? "76.3%"
                : oneRow
                    ? "67.6%"
                    : "64.7%"
        )
    }

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
    }, [loggedInUser, activeReload]);


    useEffect( () => {
        async function fetchUpcomingSessions() {
            axios.get(`http://192.168.0.14:8080/tuter/tutor/tutoring-session/${loggedInUser.user_id}`).then(
                (response) => {
                    setUpcomingSessions(response.data);
                }
            ).catch(err => console.log(err));

        }
        fetchUpcomingSessions();
    }, [loggedInUser, sessionReload]);

    return (
        <View>
            <CourseMasterModalComponent
                visible={openMasterModal}
                closeModal={toggleMasterModal}
                master={selectedMaster}
                navigation={props.navigation}
                selectingCourse={false}
                refresh={toggleActiveReload}
            />

            <UpcoingSessionModalComponent
                visible={openModal}
                closeModal={toggleModal}
                session={selectedSession}
                refresh={toggleSessionReload}
            />

            {
                masters.length < 4
                    ? <View style={{alignItems: "center", justifyContent: "center", marginBottom: responsiveHeight(3)}}>
                        <ActionButtonComponent
                            label={"Select Mastered Courses"}
                            labelColor={"#ffffff"}
                            buttonColor={"#85CB33"}
                            width={responsiveWidth(88)}
                            height={responsiveHeight(5.7)}
                            bold={true}
                            onPress={() => props.navigation.navigate("Activity", {screen: "Faculties"})}
                        />
                    </View>
                    : null
            }

            <View style={{flexDirection: "row", justifyContent: "center"}}>
                {
                    masters.length > 0
                        ? <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                            <View style={{left: "4%", flexDirection: "row", paddingBottom: 22}}>
                                {
                                    masters[0]
                                        ? <CourseMastersComponent
                                            label={masters[0].course_code}
                                            icon={masters[0].faculty}
                                            labelColor={"#000000"}
                                            backgroundColor={"#ffffff"}
                                            onPress={() => {
                                                setSelectedMaster(masters[0])
                                                toggleMasterModal()
                                            }}
                                        />
                                        : null
                                }
                                <View style={{paddingLeft: "5%"}}/>
                                {
                                    masters[1]
                                        ? <CourseMastersComponent
                                            label={masters[1].course_code}
                                            icon={masters[1].faculty}
                                            labelColor={"#000000"}
                                            backgroundColor={"#ffffff"}
                                            onPress={() => {
                                                setSelectedMaster(masters[1])
                                                toggleMasterModal()
                                            }}
                                        />
                                        : null
                                }
                            </View>
                            <View style={{left: "4%", flexDirection: "row"}}>
                                {
                                    masters[2]
                                        ? <CourseMastersComponent
                                            label={masters[2].course_code}
                                            icon={masters[2].faculty}
                                            labelColor={"#000000"}
                                            backgroundColor={"#ffffff"}
                                            onPress={() => {
                                                setSelectedMaster(masters[2])
                                                toggleMasterModal()
                                            }}
                                        />
                                        : null
                                }
                                <View style={{paddingLeft: "5%"}}/>

                                {
                                    masters[3]
                                        ? <CourseMastersComponent
                                            label={masters[3].course_code}
                                            icon={masters[3].faculty}
                                            labelColor={"#000000"}
                                            backgroundColor={"#ffffff"}
                                            onPress={() => {
                                                setSelectedMaster(masters[3])
                                                toggleMasterModal()
                                            }}
                                        />
                                        : null
                                }
                            </View>
                        </View>
                        : <Text style={{color: "white", fontSize: responsiveFontSize(2.5), fontWeight: "bold"}}>
                            You have no mastered courses!
                        </Text>
                }
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
                    {
                        upcomingSessions.length > 0
                            ? <Animatable.View
                                mounted={open}
                                animation={"fadeInUpBig"}
                                unmountAnimation={'fadeOutDownBig'}
                                style={{justifyContent:"center", marginTop: 5}}
                            >
                                <FlatList
                                    data={upcomingSessions}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                setSelectedSession(item);
                                                toggleModal();
                                            }}>
                                            <UpcomingSessionCardComponent item={item}/>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => {return index.toString();}}
                                    style={{
                                        height: setScrollViewHeight(masters.length)
                                    }}
                                />
                            </Animatable.View>
                            : null
                    }
                </View>
            </View>
        </View>
    );
}

const masteredCourses = [
    {
        course_code: "CIIC4020",
        course_id: 1,
        department: "CIIC",
        faculty: "Engineering",
        name: "Data Structures"
    },
    {
        course_code: "MATE3032",
        course_id: 1026,
        department: "MATE",
        faculty: "Arts and Sciences",
        name: "Calculus II"
    },
    {
        course_code: "CITA4305",
        course_id: 80,
        department: "CITA",
        faculty: "Agricultural Sciences",
        name: "Nutrition and Food Technology"
    },
    {
        course_code: "GERH4019",
        course_id: 1454,
        department: "GERH",
        faculty: "Business Administration",
        name: "Compensation Management"
    }
];

export default TutorHomeScreenComponent;