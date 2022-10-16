import React from "react";
import {
  Button,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import { StackActions } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import backgroundLight from "../../../assets/images/backgroundLight.png";
import appleLogo from "../../../assets/images/apple.png";
import googleLogo from "../../../assets/images/google.png";
import paw from "../../../assets/images/paw.png";

function SplashScreenComponent({ navigation }) {
  return (
    <Animatable.View style={styles.container} animation={"fadeInUp"}>
      <SafeAreaView style={styles.title}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.tuter}> Tüter </Text>

          <Image source={paw} style={styles.logo} resizeMode={"contain"} />
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
          <View style={{ padding: 8 }} />
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
            logoSize={{ width: 24, height: 24 }}
            label={"Continue with Google"}
            labelColor={"rgba(0,0,0,0.55)"}
            buttonColor={"#ffffff"}
            width={responsiveScreenWidth(80)}
            height={54}
            bold={true}
            onPress={() => {}}
          />
          <View style={{ padding: 8 }} />
          {Platform.OS === "ios" ? (
            <ActionButtonComponent
              logo={appleLogo}
              logoSize={{ width: 24, height: 24 }}
              label={"Continue with Apple"}
              labelColor={"#ffffff"}
              buttonColor={"#000000"}
              width={responsiveScreenWidth(80)}
              height={54}
              bold={true}
              onPress={() => {}}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: "71%",
    justifyContent: "center",
    // backgroundColor: "#ffffff",
  },
  title: {
    top: responsiveScreenHeight(5),
    left: responsiveScreenWidth(20),
    width: 234,
    height: 74,
    // backgroundColor: "blue",
  },
  tuter: {
    color: "white",
    fontSize: responsiveScreenFontSize(8),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    position: "absolute",
  },
  logo: {
    marginTop: responsiveScreenHeight(8),
    marginLeft: responsiveScreenWidth(52),
    height: 24,
    width: 24,
    // backgroundColor: "green",
  },
  registration: {
    flex: 1,
    flexDirection: "row",
    paddingTop: responsiveScreenHeight(10),
    marginLeft: responsiveScreenWidth(-5),
    // paddingRight: "8%",
    alignItems: "flex-end",
    // justifyContent: "flex-end",
    // backgroundColor: "red",
  },
  registrationOA2: {
    flex: 1,
    // flexDirection: "column",
    paddingTop: responsiveScreenHeight(4),
    // backgroundColor: "yellow",
    alignItems: "center",
  },
});

export default SplashScreenComponent;
