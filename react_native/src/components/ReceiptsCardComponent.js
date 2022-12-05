import { Text, View, StyleSheet } from "react-native";
import React from "react";
import {responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth} from "react-native-responsive-dimensions";
import NewProfilePicture from "./UserIconComponent";

function ViewReceiptCardComponent(props) {
  const receipt = props.receipt;
  return (
      <View style={styles.whiteCards}>
        <View style={styles.studentInfoContainer}>
          <NewProfilePicture name={receipt.tutor_name} size={50} font_size={2} top={"-30%"}/>
          <Text style={styles.name}>{receipt.tutor_name}</Text>
          <View style={{backgroundColor: "#f2f2f2", borderRadius: 10}}>
            <Text style={styles.course}>
              {receipt.service_tag}
            </Text>
          </View>
        </View>
        <View style={styles.moneyContainer}>
          <Text style={styles.money}>${receipt.total}</Text>
        </View>
      </View>
  );
}
const styles = StyleSheet.create({
  whiteCards: {
    flex: 1,
    flexDirection: "row",
    width: responsiveScreenWidth(92),
    height: responsiveScreenHeight(20),
    borderRadius: 10,
    marginLeft: responsiveScreenWidth(4),
    marginVertical: 10,
    backgroundColor: "#ffffff",
  },
  studentInfoContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    paddingLeft: responsiveScreenWidth(5),
  },
  name: {
    fontWeight: "bold",
    fontSize: responsiveFontSize(3),
    marginTop: "5%"
  },
  major: {
    fontSize: responsiveFontSize(2),
    color: "#9B9B9B",
  },
  course: {
    fontSize: responsiveFontSize(2),
    padding: 5,
  },
  moneyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  money: {
    fontSize: responsiveFontSize(4),
    fontWeight: "bold",
  },
});
export default ViewReceiptCardComponent;