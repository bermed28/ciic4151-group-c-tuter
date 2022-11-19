import React, {useEffect, useState} from "react";
import {
    Dimensions,
    Image, ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar, StyleSheet, Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView, Alert
} from "react-native";
import * as Animatable from "react-native-animatable";
import profile from "../../../assets/images/profile.png"
import paw from "../../../assets/images/paw.png";
import Feather from "react-native-vector-icons/Feather";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import {AuthContext} from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function AccountScreenComponent() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    const [userInfo, setUserInfo] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(true);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const {signOut} = React.useContext(AuthContext);

    const updateAccount = (temp) => {
        const errorAlert = (reason) => {
            console.error(reason)
            Alert.alert("Error",
                "An error occurred",
                [{text: "Okay"}]
            );
        }
        axios.put("https://tuter-app.herokuapp.com/tuter/users/" + userInfo.user_id, temp, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                setUserInfo(response.data)
            }, (reason) => {
                errorAlert(reason)
            }
        );
    };

    const updateDescription = (temp) => {
        const errorAlert = (reason) => {
            console.error(reason)
            Alert.alert("Error",
                "An error occurred",
                [{text: "Okay"}]
            );
        }
        axios.post("https://tuter-app.herokuapp.com/tuter/users/descriptions", temp, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                setDescription(response.data)
            }, (reason) => {
                errorAlert(reason)
            }
        );
    };

    const deleteAccount = () => {
        const errorAlert = (reason) => {
            console.error(reason)
            Alert.alert("Error",
                "An error occurred",
                [{text: "Okay"}]
            );
        }
        axios.delete("https://tuter-app.herokuapp.com/tuter/users/" + userInfo.user_id, {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                setDescription(response.data)
            }, (reason) => {
                errorAlert(reason)
            }
        );
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                await AsyncStorage.getItem("user").then(user => {
                    console.log(`Fetched User: ${user}`);
                    setUserInfo(JSON.parse(user));
                }).catch(err => {
                    console.log(err)
                });
            } catch (e) {
                console.log(e);
            }
        }

        fetchUser();
        console.log(`Stored User: ${userInfo}`)
        console.log(`Type of User: ${typeof userInfo}`)
    }, []);


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: responsiveHeight(10)}}>
            <ImageBackground source={userInfo.picture !== "" ? {uri: userInfo.picture} : profile}
                             blurRadius={userInfo.picture !== "" ? 0.7 : 3} resizeMode="cover"
                             style={{width: "100%", height: "70%", justifyContent: "center"}}>
                <SafeAreaView>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
                        <StatusBar backgroundColor={"rgba(6, 144, 68, 1)"} barStyle={"dark-content"}/>
                        <View style={{paddingTop: "125%", paddingBottom: "35%"}}/>
                        <View style={[styles.footer, {backgroundColor: "#ffffff"}]}>
                            <View style={{alignItems: "center", height: responsiveHeight(2.5)}}>
                                <Image source={userInfo.picture !== "" ? {uri: userInfo.picture} : profile}
                                       style={styles.profilePictureCircle}/>
                            </View>

                            <View style={{alignItems: "center"}}>
                                <Text style={{
                                    fontSize: responsiveFontSize(4.5),
                                    height: responsiveHeight(6.2),
                                    paddingTop: responsiveHeight(1.0)
                                }}>{userInfo.username}</Text>
                            </View>


                            <Text style={[styles.text_footer]}>Edit Username</Text>
                            <View style={[styles.action, {paddingRight: 5}]}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    placeholder={userInfo.username}
                                    clearButtonMode={"while-editing"}
                                    placeholderTextColor={"rgba(0,0,0,0.45)"}
                                    style={[styles.textInput]}
                                    onChangeText={(username) => setUsername(username)}
                                />
                            </View>

                            <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Edit Email</Text>
                            <View style={[styles.action, {paddingRight: 5}]}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    placeholder={userInfo.email}
                                    clearButtonMode={"while-editing"}
                                    placeholderTextColor={"rgba(0,0,0,0.45)"}
                                    style={[styles.textInput]}
                                    onChangeText={(email) => setEmail(email)}
                                />
                            </View>
                            <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Edit Name</Text>
                            <View style={[styles.action, {paddingRight: 5}]}>
                                <TextInput
                                    autoCapitalize={'words'}
                                    placeholder={userInfo.name}
                                    clearButtonMode={"while-editing"}
                                    placeholderTextColor={"rgba(0,0,0,0.45)"}
                                    style={[styles.textInput]}
                                    onChangeText={(name) => setName(name)}
                                />
                            </View>
                            <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Edit Password</Text>
                            <View style={styles.action}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    secureTextEntry={showPassword}
                                    placeholder={"Enter your new password"}
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
                            <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Edit Description</Text>
                            <View style={[styles.action, {paddingRight: 5}]}>
                                <TextInput
                                    autoCapitalize={'sentences'}
                                    placeholder={userInfo.description}
                                    clearButtonMode={"while-editing"}
                                    placeholderTextColor={"rgba(0,0,0,0.45)"}
                                    style={[styles.textInput]}
                                    onChangeText={(description) => setDescription(description)}
                                />
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", marginTop: responsiveHeight(1)}}>
                                <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Tutor Mode:</Text>
                                <View style={{paddingLeft: responsiveWidth(3), marginTop: responsiveHeight(5)}}/>
                                <Switch value={userInfo.user_role === 'Tutor'} onValueChange={() => {
                                    let temp = {
                                        balance: userInfo.balance,
                                        username: userInfo.username,
                                        name: userInfo.name,
                                        email: userInfo.email,
                                        password: userInfo.password,
                                        user_role: userInfo.user_role === 'Tutor' ? "Student" : "Tutor",
                                        department: userInfo.department,
                                        description: userInfo.description,
                                        hourly_rate: userInfo.hourly_rate,
                                        user_id: userInfo.user_id,
                                        user_rating: userInfo.user_rating,
                                        picture: userInfo.picture
                                    };
                                    console.log(temp);
                                    setUserInfo(temp);
                                    updateAccount(temp)
                                }} style={{top: 5}}/>
                            </View>


                            <View style={{alignItems: "center", paddingBottom: "38%"}}>
                                <View style={{paddingTop: "5%"}}/>
                                <ActionButtonComponent
                                    label={"Update Account"}
                                    labelColor={"#ffffff"}
                                    buttonColor={"#85CB33"}
                                    width={responsiveWidth(88)}
                                    height={responsiveHeight(5.7)}
                                    bold={true}
                                    onPress={() => {
                                        let temp = {
                                            balance: userInfo.balance,
                                            username: username === "" ? userInfo.username : username,
                                            name: name === "" ? userInfo.name : name,
                                            email: email === "" ? userInfo.email : email,
                                            password: password === "" ? userInfo.password : password,
                                            user_role: userInfo.user_role,
                                            department: userInfo.department,
                                            description: description === "" ? userInfo.description : description,
                                            hourly_rate: userInfo.hourly_rate,
                                            user_id: userInfo.user_id,
                                            user_rating: userInfo.user_rating,
                                            picture: userInfo.picture
                                        };
                                        setUserInfo(temp);
                                        updateAccount(temp)
                                        updateDescription({user_id: temp.user_id, description: temp.description})
                                    }}
                                />

                                <View style={{paddingTop: "5%"}}/>

                                <ActionButtonComponent
                                    label={"Logout"}
                                    labelColor={"#ffffff"}
                                    buttonColor={"#85CB33"}
                                    width={responsiveWidth(88)}
                                    height={responsiveHeight(5.7)}
                                    bold={true}
                                    onPress={() => {
                                        signOut()
                                    }}
                                />
                                <View style={{paddingTop: "5%"}}/>
                                <ActionButtonComponent
                                    label={"Delete account"}
                                    labelColor={"#ffffff"}
                                    buttonColor={"#EE0101"}
                                    width={responsiveWidth(88)}
                                    height={responsiveHeight(5.7)}
                                    bold={true}
                                    onPress={() => {
                                        Alert.alert("Are you sure?",
                                            "Are you sure you want to delete your account? This action cannot be undone.",
                                            [{
                                                text: "No", onPress: () => {
                                                }
                                            }, {
                                                text: "Yes, I'm sure", onPress: () => {
                                                    signOut();
                                                    deleteAccount();
                                                }
                                            }]
                                        );
                                    }}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </ScrollView>

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
        marginTop: 0,
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
        fontSize: responsiveFontSize(2.1)
    },
    profilePictureCircle: {
        position: "relative",
        width: 150,
        height: 150,
        top: "-570%",
        borderRadius: 270,
        borderWidth: 0,

    }
})

export default AccountScreenComponent;