import React from "react";
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import NavigationActionButtonComponent from "../../components/NavigationActionButtonComponent";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable'

function FacultiesScreenComponent(props, { navigation }) {

    const tutoringOptions = () => {
        return (
            <View style={{ flex: 1, alignItems: "center"}}>
                <NavigationActionButtonComponent
                    label={"Arts & Sciences"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {console.log("Hello!")}}
                />
                <NavigationActionButtonComponent
                    label={"Agricultural Sciences"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {console.log("Hello!")}}
                />
                <NavigationActionButtonComponent
                    label={"Business Administration"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {console.log("Hello!")}}
                />
                <NavigationActionButtonComponent
                    label={"Engineering"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {console.log("Hello!")}}
                />
            </View>
        );

    }

    const mockinterviewOptions = () => {
        return (
            <View style={{ flex: 1, alignItems: "center"}}>
                <NavigationActionButtonComponent
                    label={"Behavioral Interview"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {console.log("Hello!")}}
                />
                <NavigationActionButtonComponent
                    label={"Technical Interview"}
                    labelColor={"#000000"}
                    buttonColor={"#ffffff"}
                    width={responsiveWidth(88)}
                    height={responsiveHeight(6)}
                    margin={responsiveHeight(1)}
                    bold={true}
                    onPress={() => {console.log("Hello!")}}
                />
            </View>
        );
    }

    console.log(props.activityType)
    return (
        <SafeAreaView style={{flexGrow: 1}}>
            <Animatable.View animation={'fadeInUpBig'} style={{marginLeft: responsiveWidth(6), marginBottom: responsiveHeight(2)}}>
                <Text style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 25
                }}>
                    {props.activityType.activity === "Tutoring" ? "Faculties" : "Interview Type"}
                </Text>

                <View style={{alignItems: "flex-start"}}>
                    {
                        props.activityType.activity === "Tutoring"
                        ?  tutoringOptions()
                        : mockinterviewOptions()
                    }
                </View>


            </Animatable.View>

        </SafeAreaView>
    );
}

export default FacultiesScreenComponent;