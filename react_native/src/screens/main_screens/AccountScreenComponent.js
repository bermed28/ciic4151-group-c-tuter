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
import Feather from "react-native-vector-icons/Feather";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import DropdownComponent from "../../components/ElementDropdownComponent";
import NewProfilePicture from "../../components/UserIconComponent";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import {AuthContext} from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function AccountScreenComponent() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [actualPassword, setActualPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [hourly_rate, setHourlyRate] = useState(-1);
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
                "You entered the password incorrectly.",
                [{text: "Okay"}]
            );
        }
        if(actualPassword === "") {
            Alert.alert("Error",
                "Please provide your current password.",
                [{text: "Okay"}]
            );
        }
        else {
            console.log("Estoy aqui")
            console.log(temp)
            axios.put("https://tuter-app.herokuapp.com/tuter/users/" + userInfo.user_id, temp, {headers: {'Content-Type': 'application/json'}}).then(
                (response) => {
                    setUserInfo(response.data)
                }, (reason) => {
                    errorAlert(reason)
                }
            );
        }
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
        <SafeAreaView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
                <StatusBar backgroundColor={"rgba(6, 144, 68, 1)"} barStyle={"light-content"}/>
                <View style={{paddingTop: "35%", paddingBottom: "35%"}}/>
                <View style={[styles.footer, {backgroundColor: "#ffffff"}]}>
                    <View style={{alignItems: "center", height: responsiveHeight(2.5)}}>
                        <NewProfilePicture name={userInfo.name} size={150} font_size={6} top={"-570%"}/>
                    </View>

                    <View style={{alignItems: "center"}}>
                        <Text style={{
                            fontSize: responsiveFontSize(4.5),
                            height: responsiveHeight(6.2),
                            paddingTop: responsiveHeight(1.0)
                        }}>{userInfo.username}</Text>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
                                AsyncStorage.setItem('user', JSON.stringify(temp));
                            }} style={{top: 5}}/>
                        </View>

                        {userInfo.user_role === 'Student' ? null :
                            <Animatable.View animation={"fadeInLeft"} duration={500}>
                                <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Change
                                    Hourly Rate</Text>
                                <View style={[styles.action, {paddingRight: 5}]}>
                                    <TextInput
                                        placeholder={userInfo.hourly_rate}
                                        keyboardType={"numeric"}
                                        clearButtonMode={"while-editing"}
                                        placeholderTextColor={"rgba(0,0,0,0.45)"}
                                        style={[styles.textInput]}
                                        onChangeText={(hourly_rate) => setHourlyRate(hourly_rate)}
                                    />
                                </View>
                            </Animatable.View>
                        }

                        <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Change
                            Department</Text>
                        <DropdownComponent setDepartment={setDepartment}/>

                        <Text style={[styles.text_footer, {marginTop: responsiveHeight(1)}]}>Confirm Password</Text>
                        <View style={styles.action}>
                            <TextInput
                                autoCapitalize={'none'}
                                secureTextEntry={showPassword}
                                placeholder={"Confirm your current password"}
                                clearButtonMode={"while-editing"}
                                placeholderTextColor={"rgba(0,0,0,0.45)"}
                                style={[styles.textInput]}
                                onChangeText={
                                    (pass) => {
                                        if (pass.trim().length >= 8) {
                                            setActualPassword(pass);
                                            setIsValidPassword(true);
                                        } else {
                                            setActualPassword(pass);
                                            setIsValidPassword(!pass.trim().length > 0);
                                        }
                                    }
                                }
                                onEndEditing={() => {
                                    if (actualPassword.trim().length < 8 && actualPassword.trim().length > 0) setIsValidPassword(false);
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
                        <Text style={[styles.alertText, {marginTop: responsiveHeight(1)}]}>*In order to update your
                        information, you must confirm your current password.</Text>

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
                                        password: password === "" ? actualPassword : password,
                                        user_role: userInfo.user_role,
                                        department: department === "" ? userInfo.department : department,
                                        description: description === "" ? userInfo.description : description,
                                        hourly_rate: hourly_rate === -1 ? userInfo.hourly_rate : hourly_rate,
                                        user_id: userInfo.user_id,
                                        user_rating: userInfo.user_rating,
                                        picture: userInfo.picture
                                    };
                                    setUserInfo(temp);
                                    updateAccount(temp)
                                    AsyncStorage.setItem('user', JSON.stringify(temp));
                                    // updateDescription({user_id: temp.user_id, description: temp.description})
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
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

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
    },
    alertText: {
        color: "red",
        fontSize: responsiveFontSize(1.5)
    }
})

export default AccountScreenComponent;