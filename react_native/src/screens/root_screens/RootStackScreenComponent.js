import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dimensions, ImageBackground, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import backgroundLight from "../../../assets/images/backgroundLight.png";
import * as Animatable from "react-native-animatable";
import SplashScreenComponent from "./SplashScreenComponent";
import SignInScreenComponent from "./SignInScreenComponent";
import SignUpScreenComponent from "./SignUpScreenComponent";
import HomeScreenComponent from "../main_screens/HomeScreenComponent";
import AccountScreenComponent from "../main_screens/AccountScreenComponent";
import WalletScreenComponent from "../main_screens/WalletScreenComponent";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function RootStackScreenComponent() {
  const loggedIn = true;
  return (
    <ImageBackground
      source={backgroundLight}
      resizeMode="cover"
      style={{ width: "100%", flex: 1, justifyContent: "center" }}
    >
      {!loggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name={"SplashScreen"}
            component={SplashScreenComponent}
          />
          <Stack.Screen
            name={"SignIn"}
            component={SignInScreenComponent}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name={"SignUp"}
            component={SignUpScreenComponent}
            options={{ headerBackTitle: "Back" }}
          />
        </Stack.Navigator>
      ) : (
        <Animatable.View animation={"fadeInUp"} style={{ flex: 1 }}>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
              backgroundColor: "#ffff",
              showLabel: false,
              tabBarStyle: {
                position: "absolute",
                alignItems: "center",
                backgroundColor: "#ffffff",
                height: 90,
              },
            }}
          >
            <Tab.Screen
              name={"Home"}
              component={HomeScreenComponent}
              options={{
                headerShown: false,
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={{
                      fontSize: 10,
                      color: focused ? "#000000" : "#696969",
                    }}
                  >
                    Home
                  </Text>
                ),
                tabBarIconStyle: { top: 5 },
                tabBarIcon: ({ focused }) => (
                  <Icon
                    name={"home"}
                    color={focused ? "#000000" : "#696969"}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name={"Wallet"}
              component={WalletScreenComponent}
              options={{
                headerShown: false,
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={{
                      fontSize: 10,
                      color: focused ? "#000000" : "#696969",
                    }}
                  >
                    Wallet
                  </Text>
                ),
                tabBarIconStyle: { top: 5 },
                tabBarIcon: ({ focused }) => (
                  <Icon
                    name={"wallet"}
                    color={focused ? "#000000" : "#696969"}
                    size={26}
                  />
                ),
              }}
            />

            <Tab.Screen
              name={"Account"}
              component={AccountScreenComponent}
              options={{
                headerShown: false,
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={{
                      fontSize: 10,
                      color: focused ? "#000000" : "#696969",
                    }}
                  >
                    Account
                  </Text>
                ),
                tabBarIconStyle: { top: 5 },
                tabBarIcon: ({ focused }) => (
                  <Icon
                    name={"ios-person"}
                    color={focused ? "#000000" : "#696969"}
                    size={26}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </Animatable.View>
      )}
    </ImageBackground>
  );
}
export default RootStackScreenComponent;
