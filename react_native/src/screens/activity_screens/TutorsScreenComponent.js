import React from "react";
import {Button, SafeAreaView, Text, View} from "react-native";

function TutorsScreenComponent({ navigation }) {
    return (
        <SafeAreaView style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{alignItems: "center", justifyContent:"center"}}>Tutors Screen</Text>
            <Button onPress={() => {navigation.navigate("Booking")}}  title={"Go To Booking Page"}/>
        </SafeAreaView>
    );
}

export default TutorsScreenComponent;