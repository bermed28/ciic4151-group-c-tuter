import React from "react";
import {Button, SafeAreaView, Text, View} from "react-native";

function TutorBookingScreenComponent() {
    return (
        <SafeAreaView style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{alignItems: "center", justifyContent:"center"}}>Booking Screen</Text>
            <Button onPress={() => {console.log("Booked!")}}  title={"Book Tutor"}/>
        </SafeAreaView>
    );
}

export default TutorBookingScreenComponent;