import React, {useContext} from 'react';
import {Modal, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from 'react-native-animatable';
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {BookingContext} from "./Context";

function RecentBookingModalComponent(props) {
    const {bookingData, updateBookingData} = useContext(BookingContext);
    console.log(bookingData);

    return (
        <Modal transparent visible={props.visible}>
            <View style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Animatable.View duration={600} animation={"bounceIn"} style={{
                    width: "75%",
                    height: "50%",
                    backgroundColor: "#E5E4E2"
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: responsiveHeight(3),
                        marginBottom: responsiveHeight(1)
                    }}>
                        <View style={{
                            marginLeft: responsiveWidth(3),
                            marginRight: responsiveWidth(12),
                            alignItems: "center"
                        }}>
                            <FontAwesome
                                name="circle"
                                color={"#000000"}
                                size={50}
                            />
                        </View>
                        <View style={{marginRight: responsiveWidth(15), alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 16, fontWeight:"bold"}}>{bookingData.tutor.name}</Text>
                            <View style={{backgroundColor: "#D3D3D3", borderRadius: 5, padding: 5}}>
                                <Text style={{fontSize: 10}}>{bookingData.course}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{borderColor: "#000000",
                            marginRight: responsiveWidth(10)}} onPress={props.closeModal}>
                            <FontAwesome name="times-circle" size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginLeft: responsiveWidth(3),
                        marginRight: responsiveWidth(3),
                        height: responsiveHeight(25)
                    }}>
                        <Text style={{fontSize: 14, marginBottom: responsiveHeight(0.5)}}> Session Details</Text>
                        <View style={{
                            backgroundColor: "#ffffff",
                            width: "100%",
                            height: responsiveHeight(22),
                            marginRight: responsiveWidth(3)
                        }}>
                            <Text>LOL</Text>
                        </View>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3)}}>
                        <Text>Location</Text>
                    </View>
                    <View style={{marginLeft: responsiveWidth(3)}}>
                        <Text>Platform</Text>
                    </View>

                    <View style={{alignItems: "center"}}>
                        <TouchableOpacity style={{
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: responsiveWidth(3),
                            width: responsiveWidth(65),
                            height: responsiveHeight(5),
                            backgroundColor: "#069044"

                        }} onPress={() => console.log("Booked!")}>
                            <Text style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 16
                            }}>Book Session</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    );

}

export default RecentBookingModalComponent;