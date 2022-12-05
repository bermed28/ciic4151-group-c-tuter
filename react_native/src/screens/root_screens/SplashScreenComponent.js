import React, {useEffect, useState} from "react";
import {Dimensions, Image, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Animatable from 'react-native-animatable-unmountable'
import {appleAuth} from '@invertase/react-native-apple-authentication';
import ActionButtonComponent from "../../components/ActionButtonComponent";
import appleLogo from "../../../assets/images/apple.png"
import googleLogo from "../../../assets/images/google.png"
import BoldLogo from "../../../assets/images/Bold-Logo.png";
import axios from 'axios';
import {AuthContext} from "../../components/Context";

WebBrowser.maybeCompleteAuthSession();   //This will close your web browser after login

function SplashScreenComponent({navigation}) {
    const [gUser, setGUser] = useState('');
    const [reqError, setReqError] = useState('');

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '290934894571-ogv6ua4sds4ekmiq0ev66c4s13gksm7q.apps.googleusercontent.com',
        iosClientId: '290934894571-9vtdhbqd3ntmo2da5m45fm60nd89o1jg.apps.googleusercontent.com',
        androidClientId: '290934894571-73tlpem3nre7smeagosh8h1f0rn123ee.apps.googleusercontent.com',
        webClientId: '290934894571-a5b41c9mbsehirl1npruf9ed04uggnu8.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const {authentication} = response;
            signInGoogleUser(authentication.accessToken);
        }
    }, [response]);

    //Request user information to Google API
    const signInGoogleUser = async (accessToken) => {
        try {
            axios.get('https://www.googleapis.com/oauth2/v2/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            ).then((response) => {
                setGUser(response.data);

                const userInfo = {
                    email: String(response.data.email),
                    name: String(response.data.name),
                    password: "",
                    username: String(response.data.email),
                    user_role: "Student",
                };

                axios.post('https://tuter-app.herokuapp.com/tuter/users',
                    userInfo,
                    {headers: {'Content-Type': 'application/json'}}
                ).then(
                    (responseEndpoint) => {
                        signIn({...responseEndpoint.data, picture: ""});
                    }, () => {
                        const userInfo = {
                            email: String(response.data.email),
                            name: String(response.data.name),
                            password: "",
                            username: String(response.data.email),
                            user_role: "Student",
                            picture: String(response.data.picture)
                        };
                        signIn(userInfo)
                    }
                );
            }, (reason) => {
                console.log(reason)
            })
        } catch (error) {
            setReqError(error.response.data);
        }

    }

    const handleSignInWithApple = () => {
        // performs login request
        return appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // Note: it appears putting FULL_NAME first is important, see issue #293
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        }).then((appleAuthRequestResponse) => {
            let appleId = appleAuthRequestResponse.user;
            let appleEmail = appleAuthRequestResponse.email;
            let appleName = `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`;

            if (!appleEmail && appleName === `${null} ${null}`) {
                const userInfo = {
                    email: String(appleId),
                    password: "",
                };
                axios.post('https://tuter-app.herokuapp.com/tuter/login',
                    userInfo,
                    {headers: {'Content-Type': 'application/json'}}
                ).then(
                    (responseEndpoint) => {
                        signIn({...responseEndpoint.data, picture: ""});
                    }, (reason) => {
                        console.log(reason)
                    }
                );
            } else {
                const userInfo = {
                    email: String(appleId),
                    name: String(appleName),
                    password: "",
                    username: String(appleEmail),
                    user_role: "Student",
                };
                axios.post('https://tuter-app.herokuapp.com/tuter/users',
                    userInfo,
                    {headers: {'Content-Type': 'application/json'}}
                ).then(
                    (responseEndpoint) => {
                        signIn({...responseEndpoint.data, picture: ""});
                    }, (reason) => {
                        console.log(reason)
                    }
                );
            }
        });

    }

    // useEffect(() => {
    //     // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    //     return appleAuth.onCredentialRevoked(async () => {
    //         console.warn('If this function executes, User Credentials have been Revoked');
    //     });
    // }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.


    const {signIn} = React.useContext(AuthContext);
    const win = Dimensions.get('window');

    return (
        <Animatable.View duration={600} style={styles.container} animation={"fadeInUp"}>
            <SafeAreaView style={styles.title}>
                <View style={{flexDirection: "row"}}>
                    <Image
                        source={BoldLogo}
                        style={{
                            width: win.width / 2.2,
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
                        onPress={() => {
                            promptAsync()
                        }}
                    />
                    <View style={{padding: Platform.OS === "ios" ? 8 : 0}}/>
                    {Platform.OS === "ios" ? <ActionButtonComponent
                        logo={appleLogo}
                        logoSize={{width: 24, height: 24}}
                        label={"Continue with Apple"}
                        labelColor={"#ffffff"}
                        buttonColor={"#000000"}
                        width={261}
                        height={54}
                        bold={true}
                        onPress={() => handleSignInWithApple()}
                    /> : null}
                </View>
            </SafeAreaView>
        </Animatable.View>
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
        paddingTop: Platform.OS === 'ios' ? "60%" : "30%",
        paddingRight: "8%",
        alignItems: "flex-end",
        justifyContent: "flex-end"
    }
})

export default SplashScreenComponent;