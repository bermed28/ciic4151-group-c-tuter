import { Text, View, StyleSheet } from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

function ViewReceiptCardComponent(props) {
  const receipt = props.receipt;
  return (
    <View style={styles.whiteCards}>
      <View style={styles.studentInfoContainer}>
        <Feather
          name={"circle"}
          size={responsiveFontSize(6)}
        />
        <Text style={styles.name}>{receipt.tutor_name}</Text>
        <Text style={styles.course}>{receipt.service_tag}</Text>
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
  },
  major: {
    fontSize: responsiveFontSize(2),
    color: "#9B9B9B",
  },
  course: {
    fontSize: responsiveFontSize(1.5),
    borderRadius: 15,
    backgroundColor: "#f2f2f2",
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