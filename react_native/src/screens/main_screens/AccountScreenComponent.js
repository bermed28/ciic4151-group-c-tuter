import React, {useState} from "react";
import {
    Dimensions,
    Image, ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as Animatable from "react-native-animatable";
import profile from "../../../assets/images/profile.png"
import paw from "../../../assets/images/paw.png";
import Feather from "react-native-vector-icons/Feather";
import ActionButtonComponent from "../../components/ActionButtonComponent";

function AccountScreenComponent(){
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(true);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ImageBackground source={profile} blurRadius={3} resizeMode="cover" style={{ width: "100%", height: "70%",  justifyContent: "center" }}>
            <SafeAreaView>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
                    <StatusBar backgroundColor={"rgba(6, 144, 68, 1)"} barStyle={"dark-content"}/>
                    <View style={{paddingTop: "100%", paddingBottom: "35%"}}/>
                    <View style={[styles.footer, {backgroundColor: "#ffffff"}]}>
                        <View style={{}}>
                            <Image source={profile} style={styles.profilePictureCircle}/>
                        </View>

                        <View style={{alignItems:"center", paddingTop: 20}}>
                            <Text style={{fontSize: 34}}>bermed28</Text>
                        </View>


                        <Text style={[styles.text_footer, {marginTop: 25}]}>Username</Text>
                        <View style={[styles.action, {paddingRight: 5}]}>
                            <TextInput
                                autoCapitalize={'none'}
                                placeholder={"Enter your username"}
                                clearButtonMode={"while-editing"}
                                placeholderTextColor={"rgba(0,0,0,0.45)"}
                                style={[styles.textInput]}
                                onChangeText={(username) => setUsername(username)}
                            />
                        </View>

                        <Text style={[styles.text_footer, {marginTop: 25}]}>Email</Text>
                        <View style={[styles.action, {paddingRight: 5}]}>
                            <TextInput
                                autoCapitalize={'none'}
                                placeholder={"Enter your email"}
                                clearButtonMode={"while-editing"}
                                placeholderTextColor={"rgba(0,0,0,0.45)"}
                                style={[styles.textInput]}
                                onChangeText={(email) => setEmail(email)}
                            />
                        </View>
                        <Text style={[styles.text_footer, {marginTop: 25}]}>Password</Text>
                        <View style={styles.action}>
                            <TextInput
                                autoCapitalize={'none'}
                                secureTextEntry={showPassword}
                                placeholder={"Enter your password"}
                                clearButtonMode={"while-editing"}
                                placeholderTextColor={"rgba(0,0,0,0.45)"}
                                style={[styles.textInput]}
                                onChangeText={
                                    (pass) => {
                                        if(pass.trim().length >= 8) {
                                            setPassword(pass);
                                            setIsValidPassword(true);
                                        } else {
                                            setPassword(pass);
                                            setIsValidPassword(!pass.trim().length > 0);
                                        }
                                    }
                                }
                                onEndEditing={() => {
                                    if(password.trim().length < 8 && password.trim().length > 0) setIsValidPassword(false);
                                    else setIsValidPassword(true);
                                }}
                            />
                            <View style={{padding: 5}}>
                                <TouchableOpacity onPress={handleShowPassword}>
                                    {showPassword === true && <Feather name="eye-off" color={"rgba(0,0,0,0.45)"} size={20}/>}
                                    {showPassword === false && <Feather name="eye" color={"rgba(0,0,0,0.45)"} size={20}/>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {isValidPassword ? null :
                            <Animatable.View animation={"fadeInLeft"} duration={500}>
                                <Text style={styles.errorMsg}>Password must be at least 8 characters long</Text>
                            </Animatable.View>
                        }
                        <View style={{alignItems: "center", paddingTop: 55, paddingBottom: "50%"}}>
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
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get("screen").height,
        justifyContent: "center",
        paddingTop: "12.5%",
    },
    title: {
        position: 'relative',
        left: '30%',
        right: '50%',
        width: 234,
        height: 74,
        paddingTop: "75%",
        paddingBottom: "25%"
    },
    footer: {
        backgroundColor: "#ffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        paddingBottom: "60%"
    },
    errorMsg: {
        marginTop: 10,
        color: 'red'
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: "#05375a"
    },
    action:{
        flexDirection: "row",
        height: 44,
        marginTop:10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#000000",
        padding: 5,
        paddingRight: 5,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
        shadowColor: "rgba(0,0,0,0.75)"
    },
    text_footer:{
        color: "#05375a",
        fontSize: 18
    },
    profilePictureCircle:{
        position: "absolute",
        width: 100,
        height: 100,
        top: "-8%",
        borderRadius: 270,
        borderWidth: 0,

    }
})

export default AccountScreenComponent;