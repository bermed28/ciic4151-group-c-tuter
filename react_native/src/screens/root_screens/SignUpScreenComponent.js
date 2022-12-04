import React, {useState} from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform, SafeAreaView,
    StatusBar,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View, ScrollView, Switch
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from 'react-native-animatable'
import BoldLogo from "../../../assets/images/Bold-Logo.png";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import axios from "axios";
import {AuthContext} from "../../components/Context";
import ElementDropdownComponent from "../../components/ElementDropdownComponent";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";

function SignUpScreenComponent({navigation}) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("Student");
    const [hourly_rate, setHourlyRate] = useState(-1);

    const [showPassword, setShowPassword] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(true);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const {signUp} = React.useContext(AuthContext);
    const win = Dimensions.get('window');

    const handleSignUp = (navigation) => {
        const json = {
            name: String(name),
            username: String(username),
            email: String(email),
            password: String(password),
            department: department,
            user_role: role,
            hourly_rate: hourly_rate === -1 ? null : hourly_rate
        }
        const url = `https://tuter-app.herokuapp.com/tuter/users`;
        if (name === "" || username === "" || email === "" || password === "") {
            Alert.alert("Invalid Input", "Fields cannot be emtpy", [{text: "Okay"}]);
        } else {

            axios.post(url, json, {headers: {'Content-Type': 'application/json'}})
                .then((response) => {
                        Alert.alert("Success", "Account Successfully Created", [{text: "Okay"}]);
                        signUp({...response.data, picture: ""});
                    }, (error) => {
                        Alert.alert("Error", "Account is already created", [{text: "Okay"}]);
                        navigation.goBack();
                        console.log(error);
                    }
                );

        }
    }

    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
                <StatusBar backgroundColor={"rgba(6, 144, 68, 1)"} barStyle={"light-content"}/>
                <Animatable.View animation={"slideInDown"} style={styles.title}>
                    <View style={{flexDirection: "row"}}>
                        <Image
                            source={BoldLogo}
                            style={{
                                width: win.width/2.2,
                            }}
                            resizeMode={"contain"}
                        />
                    </View>
                </Animatable.View>
                <View style={{padding: 10}}/>
                <Animatable.View animation={"fadeInUpBig"} style={[styles.footer, {backgroundColor: "#ffffff"}]}>
                    <View style={{alignItems: "center", paddingBottom: 39}}>
                        <Text style={{fontSize: 34}}>Sign Up</Text>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}}>

                        <Text style={styles.text_footer}>Name</Text>
                        <View style={[styles.action, {paddingRight: 5}]}>
                            <TextInput
                                autoCapitalize={'words'}
                                placeholder={"Enter your name"}
                                clearButtonMode={"while-editing"}
                                placeholderTextColor={"rgba(0,0,0,0.45)"}
                                style={[styles.textInput]}
                                onChangeText={(name) => setName(name)}
                            />
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
                                        if (pass.trim().length >= 8) {
                                            setPassword(pass);
                                            setIsValidPassword(true);
                                        } else {
                                            setPassword(pass);
                                            setIsValidPassword(!pass.trim().length > 0);
                                        }
                                    }
                                }
                                onEndEditing={() => {
                                    if (password.trim().length < 8 && password.trim().length > 0) setIsValidPassword(false);
                                    else setIsValidPassword(true);
                                }}
                            />
                            <View style={{padding: 5}}>
                                <TouchableOpacity onPress={handleShowPassword}>
                                    {showPassword === true &&
                                        <Feather name="eye-off" color={"rgba(0,0,0,0.45)"} size={20}/>}
                                    {showPassword === false &&
                                        <Feather name="eye" color={"rgba(0,0,0,0.45)"} size={20}/>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {isValidPassword ? null :
                            <Animatable.View animation={"fadeInLeft"} duration={500}>
                                <Text style={styles.errorMsg}>Password must be at least 8 characters long</Text>
                            </Animatable.View>
                        }
                        <Text style={[styles.text_footer, {marginTop: 25}]}>Department</Text>
                        <ElementDropdownComponent setDepartment={setDepartment}/>
                        <View style={{flexDirection: "row", alignItems: "center", marginTop: responsiveHeight(1)}}>
                            <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Tutor Mode:</Text>
                            <View style={{paddingLeft: responsiveWidth(3), marginTop: responsiveHeight(5)}}/>
                            <Switch value={role === "Tutor"} onValueChange={() => {
                                setRole(role === "Student" ? "Tutor" : "Student");
                            }} style={{top: 5}}/>
                        </View>
                        {role === 'Student' ? null :
                            <Animatable.View animation={"fadeInLeft"} duration={500}>
                                <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Set
                                    Hourly Rate</Text>
                                <View style={[styles.action, {paddingRight: 5}]}>
                                    <TextInput
                                        placeholder={null}
                                        keyboardType={"numeric"}
                                        clearButtonMode={"while-editing"}
                                        placeholderTextColor={"rgba(0,0,0,0.45)"}
                                        style={[styles.textInput]}
                                        onChangeText={(hourly_rate) => setHourlyRate(hourly_rate)}
                                    />
                                </View>
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
                                onPress={() => {
                                    handleSignUp(navigation)
                                }}
                            />
                        </View>
                    </ScrollView>
                </Animatable.View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get("screen").height,
        justifyContent: "center",
        paddingTop: "12.5%"
    },
    title: {
        position: 'relative',
        left: '30%',
        right: '50%',
        width: 234,
        height: 74,
        paddingTop: "50%",
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
        shadowOffset: {width: 0, height: 3},
        shadowColor: "rgba(0,0,0,0.75)"
    },
    text_footer: {
        color: "#05375a",
        fontSize: 18
    },
})
export default SignUpScreenComponent;