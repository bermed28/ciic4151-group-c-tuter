import { Text, View, StyleSheet } from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

function RecentBookingCardComponent(props) {
  return (
    <View style={styles.whiteCards}>
      <View style={{ marginRight: responsiveScreenHeight(2) }}>
        <Feather name={"circle"} size={responsiveFontSize(6)} />
      </View>
      <View>
        <Text style={styles.name}>{props.item.name}</Text>
        <View style={styles.studentInfo}>
          <Text style={styles.major}>{props.item.major}</Text>
          <View style={styles.course}>
            <Text>{props.item.course}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  whiteCards: {
    flexDirection: "row",
    flex: 1,
    width: responsiveScreenWidth(90),
    height: responsiveHeight(18),
    borderRadius: 10,
    padding: "3.5%",
    marginLeft: "5%",
    marginVertical: responsiveHeight(1),
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  name: {
    flex: 1,
    flexGrow: 1,
    flexWrap: "wrap",
    fontSize: responsiveFontSize(2.3),
    fontWeight: "bold",
    // backgroundColor: "red",
    width: responsiveScreenWidth(70),
  },
  major: {
    color: "#666666",
    flexGrow: 1,
    flexWrap: "wrap",
    width: responsiveScreenWidth(70),
    height: responsiveHeight(1),
    // backgroundColor: "green",
  },
  course: {
    alignSelf: "left",
    flexWrap: "wrap",
    // marginTop: responsiveScreenHeight(1),
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
  },
  studentInfo: {
    flexDirection: "column",
    flexGrow: 1,
    flexWrap: "wrap",
    // justifyContent: "center",
    // paddingTop: responsiveScreenHeight(1),
    // paddingLeft: responsiveScreenWidth(1),
    // backgroundColor: "blue",
  },
});
export default RecentBookingCardComponent;
