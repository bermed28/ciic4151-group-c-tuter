import React, {useEffect, useRef, useState} from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";
import * as Animatable from 'react-native-animatable-unmountable';
import paw from "../../../assets/images/paw.png";
import Feather from "react-native-vector-icons/Feather";
import ActivityComponent from "../../components/ActivityComponent";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import SearchBarComponent from "./SearchBarComponent";
import CardDropDownComponent from "../../components/CardDropDownComponent";
import RecentBookingCardComponent from "../../components/RecentBookingCardComponent";

function HomeScreenComponent(){
    const [search, setSearch] = useState("");
    const [contentInsetBottom, setContentInsetBottom] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(-1);

    useEffect(() => {
            open ? setContentInsetBottom(dataArray.length * 200) : setContentInsetBottom(0);
        },
        [open]
    );

    const handleAction = () => {

    };

    return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            contentInset={{top:0, bottom: contentInsetBottom}}
        >
            {/*Logo*/}
            <View style={[styles.title, {flexDirection: "row"}]}>
                <Text style={{
                    color: "white",
                    fontSize: Platform.OS === "ios" ? 42 : 32,
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: { width: 0, height: 3 },
                    textShadowRadius: 10,
                    position: "absolute"
                }}> Tüter </Text>

                <Image
                    source={paw}
                    style={{
                        marginTop: "15%",
                        marginLeft: Platform.OS === "ios" ? '40%' : "36%",
                        height: 24,
                        width: 24,
                    }}
                    resizeMode={"contain"}
                />

                <Text style={{
                    color: "white",
                    fontSize: 14,
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: { width: 0, height: 3 },
                    textShadowRadius: 10,
                    position: "absolute",
                    paddingTop: 65
                }}> Find a capable tutor, anytime </Text>
            </View>

            {/*Search Bar*/}
            <SearchBarComponent style={styles.actionSearch} onChangeText={(input) => setSearch(input)}/>

            <View style={styles.actionButtonContainer}>
                <ActionButtonComponent
                    label={"Book a Tutor"}
                    labelColor={"#ffffff"}
                    buttonColor={"#85cb33"}
                    width={"100%"}
                    height={48}
                    bold={true}
                    onPress={() => handleAction()}
                />
            </View>

            {/*Feature Buttons*/}
            <View style={{flexDirection: "row", top: "15%", justifyContent: "center"}}>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <View style={{left: "4%", flexDirection: "row", paddingBottom: 22}}>
                        <ActivityComponent label={"Tutoring"} iconName={"book"} labelColor={"#000000"} backgroundColor={"#ffffff"}/>
                        <View style={{paddingLeft: "5%"}}/>
                        <ActivityComponent label={"Resume Checker"} iconName={"document"} labelColor={"#000000"} backgroundColor={"#ffffff"}/>
                    </View>
                    <View style={{left: "4%", flexDirection: "row"}}>
                        <ActivityComponent label={"Writing Help"} iconName={"pencil"} labelColor={"#000000"} backgroundColor={"#ffffff"}/>
                        <View style={{paddingLeft: "5%"}}/>
                        <ActivityComponent label={"Mock Interviews"} iconName={"people"} labelColor={"#000000"} backgroundColor={"#ffffff"}/>
                    </View>
                </View>
            </View>

            {/* Recent Bookings Cards */}
            <View style={{paddingTop: "20%"}}>
                <View>
                    <TouchableOpacity
                        style={{
                            height: 61,
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
                            <Text style={{fontSize: 16, color: "#666666"}}>Recent Bookings</Text>
                            {
                                open
                                    ? <Feather name="chevron-down" color={"#666666"} size={24} style={{position: "absolute", right: 20}}/>
                                    : <Feather name="chevron-up" color={"#666666"} size={24} style={{position: "absolute", right: 20}}/>
                            }
                        </View>
                    </TouchableOpacity>
                    <Animatable.View
                        mounted={open}
                        animation={"fadeInUpBig"}
                        unmountAnimation={'fadeOutDownBig'}
                        style={{
                            position: 'relative',
                        }}>
                        {
                            dataArray.map((item) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setSelected(item.id);
                                        }}>
                                        <RecentBookingCardComponent item={item}/>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </Animatable.View>
                </View>
            </View>
        </ScrollView>
    );
}

const dataArray = [
    {name: 'Alberto Cruz', major: "Electrical Engineering", course: "Intro. to Control Systems", id: 1},
    {name: 'Fernando Bermudez', major: "Computer Science & Engineering", course: "Data Structures", id: 2},
    {name: 'Alanis Torres', major: "Biology", course: "Genetics", id: 3},
    {name: 'Eric Pabon', major: "Mathematics", course: "Calculus II", id: 4},
];

const styles = StyleSheet.create({
    title: {
        position: 'relative',
        top: "15%",
        left: '3%',
        width: 234,
        height: 74,
    },
    actionSearch:{
        width: "93%",
        height: 46,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        marginTop:35,
        borderRadius: 10,
        top: "12%",
        left: 16,
        paddingLeft: 15,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
        shadowColor: "rgba(0,0,0,0.75)"
    },
    actionButtonContainer: {
        width: "93%",
        height: 48,
        top: "8%",
        flexDirection: "row",
        marginTop: 35,
        borderRadius: 10,
        left: 16,
    },

})
export default HomeScreenComponent;