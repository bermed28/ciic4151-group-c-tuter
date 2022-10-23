import React from "react";
import {Button, SafeAreaView, Text, View} from "react-native";

function FacultiesScreenComponent({ navigation }) {
    return (
        <SafeAreaView style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{alignItems: "center", justifyContent:"center"}}>Faculties Screen</Text>
            <Button onPress={() => {navigation.navigate("Departments")}}  title={"Go To Departments Page"}/>
        </SafeAreaView>
    );
}

export default FacultiesScreenComponent;