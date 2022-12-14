import React, {useContext, useEffect} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ActivityIndicator, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import backgroundLight from "../../../assets/images/backgroundLight.png";
import * as Animatable from "react-native-animatable"
import SplashScreenComponent from "./SplashScreenComponent";
import SignInScreenComponent from "./SignInScreenComponent";
import SignUpScreenComponent from "./SignUpScreenComponent";
import HomeScreenComponent from "../main_screens/HomeScreenComponent";
import AccountScreenComponent from "../main_screens/AccountScreenComponent";
import ReceiptsScreenComponent from "../main_screens/ReceiptsScreenComponent";
import {responsiveHeight} from "react-native-responsive-dimensions";
import BookingContextProvider, {AuthContext, BookingContext} from "../../components/Context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FacultiesScreenComponent from "../activity_screens/FacultiesScreenComponent";
import DepartmentScreenComponent from "../activity_screens/DepartmentScreenComponent";
import CoursesScreenComponent from "../activity_screens/CoursesScreenComponent";
import TutorsScreenComponent from "../activity_screens/TutorsScreenComponent";
import TutorBookingScreenComponent from "../activity_screens/TutorBookingScreenComponent";
import Feather from "react-native-vector-icons/Feather";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function RootStackScreenComponent() {

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null
    }

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETREIVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false
                };
        }
    }

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser) => {
            console.log(`Found User: ${foundUser}`)
            const userToken = foundUser.user_id;
            const username = foundUser.username;
            try {

                //await AsyncStorage.setItem('userToken', userToken)
                await AsyncStorage.setItem('user', JSON.stringify(foundUser))
            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGIN', id: username, token: userToken});
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('user');
            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGOUT'});
        },
        signUp: async (foundUser) => {
            const userToken = foundUser.user_id;
            const username = foundUser.username
            try {
                await AsyncStorage.setItem('user', JSON.stringify(foundUser))
            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'REGISTER', id: username, token: userToken});
        },
    }), []);

    useEffect(() => {
        setTimeout(async () => {
            let user = null;
            try {
                await AsyncStorage.getItem('user').then(
                    (response) => {
                        user = JSON.parse(response);
                    }, (reason) => {
                        console.error(reason);
                    }
                );
                if (user)
                    dispatch({type: "RETREIVE_TOKEN", token: user.user_id})
                else signOut();
            } catch (e) {
                signOut();
            }
        }, 1000);

    }, []);

    if (loginState.isLoading) {
        dispatch({type: 'LOGOUT'}); //for now it does not loop forever, we'll see what happens
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size={'large'}/>
            </View>
        )
    }

    const ActivityComponent = ({route, navigation}) => {
        const {bookingData} = useContext(BookingContext);
        const activity = bookingData.activity;

        return (
            <Stack.Navigator initialRouteName={"Faculties"}>
                <Stack.Screen
                    name={"Faculties"}
                    options={{
                        headerTitle: activity,
                        headerTitleStyle: {
                            color: "#ffffff",
                            fontSize: 18
                        },
                        headerTitleAlign: "center",
                        headerShown: true,
                        headerTransparent: true,
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center"}}
                                onPress={() => {
                                    navigation.goBack()
                                }}>
                                <Feather
                                    name="chevron-left"
                                    color={"#ffffff"}
                                    size={24}
                                    style={{position: "absolute"}}
                                />
                                <View style={{padding: 12.5}}/>
                                <Text style={{color: "#ffffff", fontSize: 18}}>Back</Text>
                            </TouchableOpacity>
                        )

                    }}
                >
                    {(props) => <FacultiesScreenComponent {...props} navigation={navigation}/>}
                </Stack.Screen>

                <Stack.Screen
                    name={"Departments"}
                    options={{
                        headerTitle: activity,
                        headerTitleStyle: {
                            color: "#ffffff",
                            fontSize: 18
                        },
                        headerTitleAlign: "center",
                        headerShown: true,
                        headerTransparent: true,
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center"}}
                                onPress={() => {
                                    if (activity === "Writing Help" || activity === "Resume Checker") {
                                        navigation.reset({
                                            index: 0,
                                            routes: [{name: "Home"}]
                                        })
                                    } else navigation.navigate("Faculties");
                                }}>
                                <Feather
                                    name="chevron-left"
                                    color={"#ffffff"}
                                    size={24}
                                    style={{position: "absolute"}}
                                />
                                <View style={{padding: 12.5}}/>
                                <Text style={{color: "#ffffff", fontSize: 18}}>Back</Text>
                            </TouchableOpacity>
                        )

                    }}
                >
                    {(props) => <DepartmentScreenComponent {...props} navigation={navigation}/>}
                </Stack.Screen>

                <Stack.Screen
                    name={"Courses"}
                    options={{
                        headerTitle: activity,
                        headerTitleStyle: {
                            color: "#ffffff",
                            fontSize: 18
                        },
                        headerTitleAlign: "center",
                        headerShown: true,
                        headerTransparent: true,
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center"}}
                                onPress={() => {
                                    navigation.navigate("Departments");
                                }}>
                                <Feather
                                    name="chevron-left"
                                    color={"#ffffff"}
                                    size={24}
                                    style={{position: "absolute"}}
                                />
                                <View style={{padding: 12.5}}/>
                                <Text style={{color: "#ffffff", fontSize: 18}}>Back</Text>
                            </TouchableOpacity>
                        )

                    }}
                >
                    {(props) => <CoursesScreenComponent {...props} navigation={navigation} />}
                </Stack.Screen>

                <Stack.Screen
                    name={"Tutors"}
                    component={TutorsScreenComponent}
                    options={{
                        headerTitle: activity,
                        headerTitleStyle: {
                            color: "#ffffff",
                            fontSize: 18
                        },
                        headerTitleAlign: "center",
                        headerShown: true,
                        headerTransparent: true,
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center"}}
                                onPress={() => {
                                    activity === "Mock Interviews" || activity === "Resume Checker"
                                        ? navigation.navigate("Departments")
                                        : navigation.navigate("Courses")
                                }}>
                                <Feather
                                    name="chevron-left"
                                    color={"#ffffff"}
                                    size={24}
                                    style={{position: "absolute"}}
                                />
                                <View style={{padding: 12.5}}/>
                                <Text style={{color: "#ffffff", fontSize: 18}}>Back</Text>
                            </TouchableOpacity>
                        )

                    }}
                />

                <Stack.Screen
                    name={"Booking"}
                    component={TutorBookingScreenComponent}
                    options={{
                        headerTitle: activity,
                        headerTitleStyle: {
                            color: "#ffffff",
                            fontSize: 18
                        },
                        headerTitleAlign: "center",
                        headerShown: true,
                        headerTransparent: true,
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{flexDirection: "row", alignItems: "center"}}
                                onPress={() => {
                                    navigation.navigate("Tutors")
                                }}>
                                <Feather
                                    name="chevron-left"
                                    color={"#ffffff"}
                                    size={24}
                                    style={{position: "absolute"}}
                                />
                                <View style={{padding: 12.5}}/>
                                <Text style={{color: "#ffffff", fontSize: 18}}>Back</Text>
                            </TouchableOpacity>
                        )

                    }}
                />
            </Stack.Navigator>
        );
    }
    return (
        <BookingContextProvider>
            <AuthContext.Provider value={authContext}>
                <ImageBackground source={backgroundLight} resizeMode="cover"
                                 style={{width: "100%", flex: 1, justifyContent: "center"}}>
                    {loginState.userToken === null
                        ?
                        <Stack.Navigator screenOptions={{headerShown: false}}>
                            <Stack.Screen name={"SplashScreen"} component={SplashScreenComponent}/>
                            <Stack.Screen name={"SignIn"} component={SignInScreenComponent}
                                          options={{headerBackTitle: "Back"}}/>
                            <Stack.Screen name={"SignUp"} component={SignUpScreenComponent}
                                          options={{headerBackTitle: "Back"}}/>
                        </Stack.Navigator>
                        : <Animatable.View duration={600} animation={"fadeInUp"} style={{flex: 1}}>
                            <Tab.Navigator
                                initialRouteName="Home"
                                screenOptions={{
                                    tabBarHideOnKeyboard: true,
                                    backgroundColor: "#ffff",
                                    showLabel: false,
                                    tabBarStyle: {
                                        position: "absolute",
                                        alignItems: "center",
                                        backgroundColor: "#ffffff",
                                        height: responsiveHeight(10),
                                        paddingBottom: responsiveHeight(2.5)
                                    },
                                    unmountOnBlur: true
                                }}
                            >
                                <Tab.Screen
                                    name={"Home"}
                                    component={HomeScreenComponent}
                                    options={{
                                        headerShown: false,
                                        tabBarLabel: ({focused}) => (<Text
                                            style={{fontSize: 10, color: focused ? "#000000" : "#696969"}}>Home</Text>),
                                        tabBarIconStyle: {top: 5},
                                        tabBarIcon: ({focused}) => (
                                            <Icon name={'home'} color={focused ? "#000000" : "#696969"} size={26}/>),
                                    }}
                                />
                                <Tab.Screen
                                    name={"Receipts"}
                                    component={ReceiptsScreenComponent}
                                    options={{
                                        headerShown: false,
                                        tabBarLabel: ({focused}) => (<Text
                                            style={{fontSize: 10, color: focused ? "#000000" : "#696969"}}>Receipts</Text>),
                                        tabBarIconStyle: {top: 5},
                                        tabBarIcon: ({focused}) => (
                                            <Icon name={'receipt'} color={focused ? "#000000" : "#696969"} size={26}/>),
                                    }}
                                />

                                <Tab.Screen
                                    name={"Account"}
                                    component={AccountScreenComponent}
                                    options={{
                                        headerShown: false,
                                        tabBarLabel: ({focused}) => (<Text
                                            style={{fontSize: 10, color: focused ? "#000000" : "#696969"}}>Account</Text>),
                                        tabBarIconStyle: {top: 5},
                                        tabBarIcon: ({focused}) => (
                                            <Icon name={'ios-person'} color={focused ? "#000000" : "#696969"} size={26}/>),
                                        unmountOnBlur: true
                                    }}
                                />
                                <Tab.Screen name={"Activity"} component={ActivityComponent}
                                            options={{tabBarButton: () => null, headerShown: false}}/>
                            </Tab.Navigator>
                        </Animatable.View>
                    }
                </ImageBackground>
            </AuthContext.Provider>
        </BookingContextProvider>

    );
}

export default RootStackScreenComponent;
