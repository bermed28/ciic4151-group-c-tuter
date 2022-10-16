import React, { useState } from "react";
import axios from "axios";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import paw from "../../../assets/images/paw.png";
import ActionButtonComponent from "../../components/ActionButtonComponent";

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

function SignUpScreenComponent({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const REGISTER_URL = "ec2-52-200-5-135.compute-1.amazonaws.com";

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (event) => {
    if (!username.trim() || !email.trim() || !name.trim()) {
      alert("Name or Email is invalid");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${REGISTER_URL}/tuter/users`,
        JSON.stringify({ username, password, email, name }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert(` You have created: ${JSON.stringify(response.data)}`);
        setIsLoading(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setName("");
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("An error has occurred");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <StatusBar
          backgroundColor={"rgba(6, 144, 68, 1)"}
          barStyle={"light-content"}
        />
        <Animatable.View animation={"slideInDown"} style={styles.title}>
          <View style={styles.titleBar}>
            <Text style={styles.tuter}> Tüter </Text>

            <Image
              source={paw}
              style={styles.pawImage}
              resizeMode={"contain"}
            />
          </View>
        </Animatable.View>
        {/* <View /> */}
        <Animatable.View
          animation={"fadeInUpBig"}
          style={[styles.footer, { backgroundColor: "#ffffff" }]}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 34 }}>Sign Up</Text>
          </View>

          <Text style={styles.text_footer}>Name</Text>
          <View style={[styles.action, { paddingRight: 5 }]}>
            <TextInput
              autoCapitalize={"none"}
              placeholder={"Enter your name"}
              clearButtonMode={"while-editing"}
              placeholderTextColor={"rgba(0,0,0,0.45)"}
              style={[styles.textInput]}
              onChangeText={(name) => setName(name)}
            />
          </View>

          <Text style={[styles.text_footer, { marginTop: 25 }]}>Username</Text>
          <View style={[styles.action, { paddingRight: 5 }]}>
            <TextInput
              autoCapitalize={"none"}
              placeholder={"Enter your username"}
              clearButtonMode={"while-editing"}
              placeholderTextColor={"rgba(0,0,0,0.45)"}
              style={[styles.textInput]}
              onChangeText={(username) => setUsername(username)}
            />
          </View>

          <Text style={[styles.text_footer, { marginTop: 25 }]}>Email</Text>
          <View style={[styles.action, { paddingRight: 5 }]}>
            <TextInput
              autoCapitalize={"none"}
              placeholder={"Enter your email"}
              clearButtonMode={"while-editing"}
              placeholderTextColor={"rgba(0,0,0,0.45)"}
              style={[styles.textInput]}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <Text style={[styles.text_footer, { marginTop: 25 }]}>Password</Text>
          <View style={styles.action}>
            <TextInput
              autoCapitalize={"none"}
              secureTextEntry={showPassword}
              placeholder={"Enter your password"}
              clearButtonMode={"while-editing"}
              placeholderTextColor={"rgba(0,0,0,0.45)"}
              style={[styles.textInput]}
              onChangeText={(pass) => {
                if (pass.trim().length >= 8) {
                  setPassword(pass);
                  setIsValidPassword(true);
                } else {
                  setPassword(pass);
                  setIsValidPassword(!pass.trim().length > 0);
                }
              }}
              onEndEditing={() => {
                if (password.trim().length < 8 && password.trim().length > 0)
                  setIsValidPassword(false);
                else setIsValidPassword(true);
              }}
            />
            <View style={{ padding: 5 }}>
              <TouchableOpacity onPress={handleShowPassword}>
                {showPassword === true && (
                  <Feather
                    name="eye-off"
                    color={"rgba(0,0,0,0.45)"}
                    size={20}
                  />
                )}
                {showPassword === false && (
                  <Feather name="eye" color={"rgba(0,0,0,0.45)"} size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {isValidPassword ? null : (
            <Animatable.View animation={"fadeInLeft"} duration={500}>
              <Text style={styles.errorMsg}>
                Password must be at least 8 characters long
              </Text>
            </Animatable.View>
          )}
          <View style={styles.signupButton}>
            <ActionButtonComponent
              label={"Sign Up"}
              labelColor={"#ffffff"}
              buttonColor={"#069044"}
              width={122}
              height={48}
              bold={true}
              onPress={() => handleSignUp()}
            />
          </View>
        </Animatable.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    paddingTop: "12.5%",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    justifyContent: "center",
  },
  titleBar: {
    flexDirection: "row",
    flex: 1,
    marginTop: responsiveScreenHeight(2),
  },
  tuter: {
    color: "white",
    fontSize: responsiveScreenFontSize(5),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    marginLeft: responsiveScreenWidth(50),
    marginTop: responsiveScreenHeight(60),
    position: "absolute",
  },
  pawImage: {
    flex: 1,
  },
  footer: {
    backgroundColor: "#ffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: responsiveScreenHeight(70),
  },
  errorMsg: {
    marginTop: 10,
    color: "red",
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  signupButton: {
    alignItems: "center",
    paddingTop: "10%",
    paddingBottom: "50%",
  },
  action: {
    flexDirection: "row",
    height: 44,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#000000",
    padding: 5,
    paddingRight: 5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "rgba(0,0,0,0.75)",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
});
export default SignUpScreenComponent;
