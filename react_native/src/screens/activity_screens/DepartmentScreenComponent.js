import React from "react";
import {Button, ScrollView, Text} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";

function DepartmentScreenComponent({ navigation }) {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
            <Animatable.View animation={'fadeInUpBig'} >
                <Text style={{alignItems: "center", justifyContent:"center"}}>Departments Screen</Text>
                <Button onPress={() => {navigation.navigate("Courses")}}  title={"Go To Courses Page"}/>
            </Animatable.View>

        </ScrollView>
    );
}

export default DepartmentScreenComponent;