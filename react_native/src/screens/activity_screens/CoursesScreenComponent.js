import React from "react";
import {Button, SafeAreaView, ScrollView, Text, View} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";

function CoursesScreenComponent({ navigation }) {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
            <Animatable.View animation={'fadeInUpBig'} >
                <Text style={{alignItems: "center", justifyContent:"center"}}>Courses Screen</Text>
                <Button onPress={() => {navigation.navigate("Tutors")}}  title={"Go To Tutors Page"}/>
            </Animatable.View>

        </ScrollView>
    );
}

export default CoursesScreenComponent;