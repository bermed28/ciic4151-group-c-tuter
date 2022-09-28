import React from "react";
import {Button, Dimensions, Image, ImageBackground, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {StackActions} from "@react-navigation/native";
import ActionButtonComponent from "../components/ActionButtonComponent";
import backgroundLight from "../../assets/images/backgroundLight.png"
import appleLogo from "../../assets/images/apple.png"
import googleLogo from "../../assets/images/google.png"
import paw from "../../assets/images/paw.png"

function SplashScreenComponent({navigation}){
    return(
        <View style={styles.container}>
                <SafeAreaView style={styles.title}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{
                            color: "white",
                            fontSize: 64,
                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 10,
                            position: "absolute"
                        }}> Tüter </Text>

                        <Image
                            source={paw}
                            style={{
                                marginTop: "23%",
                                marginLeft: "60%",
                                height: 24,
                                width: 24,
                            }}
                            resizeMode={"contain"}
                        />
                    </View>

                    <View style={styles.registration}>
                        <ActionButtonComponent
                            label={"Log In"}
                            labelColor={"#ffffff"}
                            buttonColor={"#069044"}
                            width={122}
                            height={48}
                            bold={false}
                            onPress={() => navigation.navigate("SignIn")}
                        />
                        <View style={{padding: 8}}/>
                        <ActionButtonComponent
                            label={"Sign Up"}
                            labelColor={"#ffffff"}
                            buttonColor={"#069044"}
                            width={122}
                            height={48}
                            bold={false}
                            onPress={() => navigation.navigate("SignUp")}
                        />
                    </View>

                    <View style={styles.registrationOA2}>
                        <ActionButtonComponent
                            logo={googleLogo}
                            logoSize={{width: 24, height: 24}}
                            label={"Continue with Google"}
                            labelColor={"rgba(0,0,0,0.55)"}
                            buttonColor={"#ffffff"}
                            width={261}
                            height={54}
                            bold={true}
                            onPress={() => {}}
                        />
                        <View style={{padding: 8}}/>
                        <ActionButtonComponent
                            logo={appleLogo}
                            logoSize={{width: 24, height: 24}}
                            label={"Continue with Apple"}
                            labelColor={"#ffffff"}
                            buttonColor={"#000000"}
                            width={261}
                            height={54}
                            bold={true}
                            onPress={() => {}}
                        />
                    </View>
                </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: "71%",
        justifyContent: "center",
    },
    title: {
        position: 'relative',
        top: '36%',
        left: '30%',
        right: '50%',
        width: 234,
        height: 74
    },
    registration: {
        flex: 1,
        flexDirection: "row",
        paddingTop: "50%",
        paddingRight: "8%",
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    registrationOA2: {
        flex: 1,
        flexDirection: "column",
        paddingTop: "60%",
        paddingRight: "8%",
        alignItems: "flex-end",
        justifyContent: "flex-end"
    }
})

export default SplashScreenComponent;