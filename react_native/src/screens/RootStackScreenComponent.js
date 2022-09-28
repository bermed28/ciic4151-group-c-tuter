import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SplashScreenComponent from "./SplashScreenComponent";
import SignInScreenComponent from "./SignInScreenComponent";
import SignUpScreenComponent from "./SignUpScreenComponent";
import {Dimensions, ImageBackground} from "react-native";
import backgroundLight from "../../assets/images/backgroundLight.png";

const Stack = createNativeStackNavigator();

function RootStackScreenComponent() {
    return (
        <ImageBackground source={backgroundLight} resizeMode="cover" style={{ width: "100%", flex: 1, justifyContent: "center" }}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name={"SplashScreen"} component={SplashScreenComponent}/>
                <Stack.Screen name={"SignIn"} component={SignInScreenComponent}  options={{headerBackTitle: "Back"}}/>
                <Stack.Screen name={"SignUp"} component={SignUpScreenComponent}  options={{headerBackTitle: "Back"}}/>
            </Stack.Navigator>
        </ImageBackground>

    );
}
const screen = Dimensions.get("screen");

export default RootStackScreenComponent;
