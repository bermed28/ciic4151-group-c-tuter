import React, {useContext} from "react";
import {Button, SafeAreaView, ScrollView, Text, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import {BookingContext} from "../../components/Context";

function TutorBookingScreenComponent() {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
            <Animatable.View animation={'fadeInUpBig'} >
                <Text style={{alignItems: "center", justifyContent:"center"}}>Booking Screen</Text>
                <Button onPress={() => {console.log("Booked!")}}  title={"Book Tutor"}/>
            </Animatable.View>
        </ScrollView>
    );
}

export default TutorBookingScreenComponent;