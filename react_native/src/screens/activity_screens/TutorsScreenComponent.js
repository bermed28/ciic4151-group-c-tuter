import React from "react";
import {Button, SafeAreaView, ScrollView, Text, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";

function TutorsScreenComponent({ navigation }) {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
            <Animatable.View animation={'fadeInUpBig'} >
                <Text style={{alignItems: "center", justifyContent:"center"}}>Tutors Screen</Text>
                <Button onPress={() => {navigation.navigate("Booking")}}  title={"Go To Bookings Page"}/>
            </Animatable.View>

        </ScrollView>
    );
}

export default TutorsScreenComponent;