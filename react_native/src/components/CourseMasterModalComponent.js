import React, {useContext} from 'react';
import {Modal, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable';
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {BookingContext} from "./Context";
import ActionButtonComponent from "./ActionButtonComponent";

function CourseMasterModalComponent(props) {

    const handleRemoveMaster = () => {

    }
    return (
        <Modal transparent visible={props.visible}>
            <View style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Animatable.View animation={"bounceIn"} style={{
                    width: "75%",
                    height: "25%",
                    backgroundColor: "white"
                }}>
                    <View style={{
                        width: "100%",
                        height: "25%",
                        flexDirection: "row",
                        justifyContent:"space-between",
                        marginRight: responsiveWidth(5)

                    }}>
                        <View style={{flexDirection: "row-reverse", paddingTop: "2%", paddingRight: "30%", alignItems: "center"}}>
                            <View style={{
                                height: "70%",
                                marginBottom: 5,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 5,
                                backgroundColor: "#f2f2f2"
                            }}>
                                <Text style={{fontWeight: "bold", fontSize: 20}}>{props.master.course_code}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", paddingRight: "5%", alignItems: "center"}}>
                            <TouchableOpacity onPress={props.closeModal}>
                                <FontAwesome name="times-circle" size={35}/>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{borderColor: "black", height: "75%"}}>
                        <View style={{alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{alignItems:"flex-start"}}>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveHeight(0.5)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Faculty: {props.master.faculty}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveHeight(0.5)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Department: {props.master.department}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", flexWrap: 'wrap', paddingBottom: responsiveWidth(0.5)}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}}>
                                        Course Name: {props.master.name}
                                    </Text>
                                </View>
                            </View>
                            <ActionButtonComponent
                                label={"Remove Mastered Course"}
                                labelColor={"#ffffff"}
                                buttonColor={"red"}
                                width={"75%"}
                                height={"35%"}
                                bold={true}
                                onPress={() => handleRemoveMaster()}
                            />
                        </View>
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    );
}

export default CourseMasterModalComponent;