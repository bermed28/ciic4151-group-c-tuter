import React from "react";
import {Button, SafeAreaView, Text} from "react-native";

function DepartmentScreenComponent({ navigation }) {
    return (
        <SafeAreaView style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{alignItems: "center", justifyContent:"center"}}>Departments Screen</Text>
            <Button onPress={() => {navigation.navigate("Courses")}}  title={"Go To Courses Page"}/>
        </SafeAreaView>
    );
}

export default DepartmentScreenComponent;