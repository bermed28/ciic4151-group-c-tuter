import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable-unmountable";
import paw from "../../../assets/images/paw.png";
import Feather from "react-native-vector-icons/Feather";
import ActivityComponent from "../../components/ActivityComponent";
import ActionButtonComponent from "../../components/ActionButtonComponent";
import SearchBarComponent from "./SearchBarComponent";
import CardDropDownComponent from "../../components/CardDropDownComponent";
import RecentBookingCardComponent from "../../components/RecentBookingCardComponent";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";

function HomeScreenComponent() {
  const [search, setSearch] = useState("");
  const [contentInsetBottom, setContentInsetBottom] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(-1);

  useEffect(() => {
    open
      ? setContentInsetBottom(dataArray.length * 200)
      : setContentInsetBottom(0);
  }, [open]);

  const handleAction = () => {};

  return (
    <ScrollView
      automaticallyAdjustContentInsets={false}
      contentInset={{ top: 0, bottom: contentInsetBottom }}
    >
      {/*Logo*/}
      <View style={[styles.title, { flexDirection: "row" }]}>
        <Text style={styles.tuter}> Tüter </Text>

        <Image source={paw} style={styles.logo} resizeMode={"contain"} />

        <Text style={styles.slogan}> Find a capable tutor, anytime </Text>
      </View>

      {/*Search Bar*/}
      <SearchBarComponent
        style={styles.actionSearch}
        onChangeText={(input) => setSearch(input)}
      />

      <View style={styles.actionButtonContainer}>
        <ActionButtonComponent
          label={"Book a Tutor"}
          labelColor={"#ffffff"}
          buttonColor={"#85cb33"}
          width={"100%"}
          height={48}
          bold={true}
          onPress={() => handleAction()}
        />
      </View>

      {/*Feature Buttons*/}
      <View style={styles.buttonsArea}>
        <View style={styles.buttonsArea2}>
          <View style={styles.topButtonsArea}>
            <ActivityComponent
              label={"Tutoring Help"}
              iconName={"book"}
              labelColor={"#000000"}
              backgroundColor={"#ffffff"}
            />
            <View style={{ paddingLeft: "5%" }} />
            <ActivityComponent
              label={"Resume Checker"}
              iconName={"document"}
              labelColor={"#000000"}
              backgroundColor={"#ffffff"}
            />
          </View>
          <View style={styles.bottomButtonsArea}>
            <ActivityComponent
              label={"Writing Help"}
              iconName={"pencil"}
              labelColor={"#000000"}
              backgroundColor={"#ffffff"}
            />
            <View style={{ paddingLeft: "5%" }} />
            <ActivityComponent
              label={"Mock Interviews"}
              iconName={"people"}
              labelColor={"#000000"}
              backgroundColor={"#ffffff"}
            />
          </View>
        </View>
      </View>

      {/* Recent Bookings Cards */}
      <View style={{ paddingTop: responsiveScreenHeight(5) }}>
        <View>
          <TouchableOpacity
            style={styles.recentBookings}
            activeOpacity={1}
            onPress={() => setOpen(!open)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#666666" }}>
                Recent Bookings
              </Text>
              {open ? (
                <Feather
                  name="chevron-down"
                  color={"#666666"}
                  size={24}
                  style={{ position: "absolute", right: 20 }}
                />
              ) : (
                <Feather
                  name="chevron-up"
                  color={"#666666"}
                  size={24}
                  style={{ position: "absolute", right: 20 }}
                />
              )}
            </View>
          </TouchableOpacity>
          <Animatable.View
            mounted={open}
            animation={"fadeInUpBig"}
            unmountAnimation={"fadeOutDownBig"}
            style={{
              position: "absolute",
              top: responsiveScreenHeight(8),
            }}
          >
            {dataArray.map((item) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setSelected(item.id);
                  }}
                >
                  <RecentBookingCardComponent item={item} />
                </TouchableOpacity>
              );
            })}
          </Animatable.View>
        </View>
      </View>
    </ScrollView>
  );
}

const dataArray = [
  {
    name: "Alberto Cruz",
    major: "Electrical Engineering",
    course: "Intro. to Control Systems",
    id: 1,
  },
  {
    name: "Fernando Bermudez",
    major: "Computer Science & Engineering",
    course: "Data Structures",
    id: 2,
  },
  { name: "Alanis Torres", major: "Biology", course: "Genetics", id: 3 },
  { name: "Eric Pabon", major: "Mathematics", course: "Calculus II", id: 4 },
];

const styles = StyleSheet.create({
  title: {
    position: "relative",
    top: "15%",
    left: "3%",
    width: 234,
    height: 74,
    // backgroundColor: "black",
  },
  tuter: {
    color: "white",
    fontSize: responsiveScreenFontSize(6),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    position: "absolute",
  },
  logo: {
    marginTop: responsiveScreenHeight(5.5),
    marginLeft: responsiveScreenWidth(40),
    height: 24,
    width: 24,
  },
  slogan: {
    color: "white",
    fontSize: responsiveScreenFontSize(2),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    position: "absolute",
    paddingTop: responsiveScreenHeight(8),
  },
  buttonsArea: {
    flex: 1,
    flexDirection: "row",
    //marginLeft: responsiveScreenWidth(3),
    marginTop: responsiveScreenHeight(3),
    // justifyContent: "center",
    //backgroundColor: "red",
  },
  buttonsArea2: {
    flex: 1,
    // marginLeft: responsiveScreenWidth(3),
    flexDirection: "row",
    //justifyContent: "center",
    flexWrap: "wrap",
    // backgroundColor: "green",
  },
  topButtonsArea: {
    marginLeft: responsiveScreenWidth(3),
    flexDirection: "row",
    paddingBottom: responsiveScreenHeight(2),
    // backgroundColor: "blue",
  },
  bottomButtonsArea: {
    marginLeft: responsiveScreenWidth(3),
    flexDirection: "row",
    // backgroundColor: "red",
  },
  actionSearch: {
    width: responsiveScreenWidth(93),
    height: responsiveScreenHeight(6),
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginTop: responsiveScreenHeight(10),
    borderRadius: 10,
    //marginTop: responsiveScreenHeight(10),
    marginLeft: responsiveScreenWidth(5),
    paddingLeft: "5%",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "rgba(0,0,0,0.75)",
  },
  recentBookings: {
    height: responsiveScreenFontSize(7),
    borderRadius: 10,
    marginLeft: responsiveScreenWidth(4),
    marginRight: responsiveScreenWidth(4),
    backgroundColor: "#ffffff",
    paddingLeft: "5%",
    justifyContent: "center",
  },
  actionButtonContainer: {
    width: responsiveScreenWidth(93),
    height: responsiveScreenHeight(6),
    //top: "8%",
    flexDirection: "row",
    marginTop: responsiveScreenHeight(3),
    borderRadius: 10,
    marginLeft: responsiveScreenWidth(5),
  },
});
export default HomeScreenComponent;
