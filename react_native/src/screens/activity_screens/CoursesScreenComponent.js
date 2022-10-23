import React from "react";
import {Button, SafeAreaView, Text, View} from "react-native";

function CoursesScreenComponent({ navigation }) {
    return (
        <SafeAreaView style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{alignItems: "center", justifyContent:"center"}}>Courses Screen</Text>
            <Button onPress={() => {navigation.navigate("Tutors")}}  title={"Go To Tutors Page"}/>
        </SafeAreaView>
    );
}

export default CoursesScreenComponent;