import React from "react";
import {Button, SafeAreaView, ScrollView, Text, View} from "react-native";
import * as Animatable from 'react-native-animatable-unmountable';

function FacultiesScreenComponent({ navigation }) {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
            <Animatable.View animation={'fadeInUpBig'} >
                <Text style={{alignItems: "center", justifyContent:"center"}}>Faculties Screen</Text>
                <Button onPress={() => {navigation.navigate("Departments")}}  title={"Go To Departments Page"}/>
            </Animatable.View>

        </ScrollView>
    );
}

export default FacultiesScreenComponent;