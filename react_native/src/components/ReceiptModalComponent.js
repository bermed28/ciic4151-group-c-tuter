import React, { useState } from "react";
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from "react-native";
import {responsiveFontSize, responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IncrementDecrementComponent from "./IncrementDecrementComponent";
import axios from "axios";
import NewProfilePicture from "./UserIconComponent";


function ReceiptModal(props) {
  const transaction = props.receipt;
  const [rating, setRating] = useState(5);

  const rateTutor = (tutorID, new_rating) => {
    axios.post("https://tuter-app.herokuapp.com/tuter/set-rating",
        {user_id: tutorID, new_rating: new_rating},
        {headers: {'Content-Type': 'application/json'}}).then(
        (response) => {
          const res = response.data;
          props.setCanRate(false); // So you can't spam rate someone
          console.log(JSON.stringify(res));
        }, (reason) => {console.log(reason)}
    );
  };

  return (
      <Modal transparent visible={props.visible}>
        <View style={styles.modalContainer}>
          <Animatable.View
              animation={"bounceIn"}
              style={{
                backgroundColor: "white",
                width: "85%",
                height: props.canRate ? "55%" : "50%",
                borderRadius: 20
              }}
          >
            <View style={[
              styles.tutorInfoComponent,
              {
                marginLeft: responsiveWidth(5),
                marginTop:responsiveHeight(3),
                flexDirection: "row"
              }
            ]}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <NewProfilePicture name={transaction.tutor_name} size={50} font_size={2} top={"-55%"}/>
                <Text style={styles.name}>{transaction.tutor_name}</Text>
              </View>
              <View style={{justifyContent: "flex-start", paddingTop: responsiveHeight(1)}}>
                <TouchableOpacity style={{borderColor: "#000000", marginRight: responsiveWidth(5)}} onPress={props.closeModal}>
                  <FontAwesome name="times-circle" size={35}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.transactionInfoComponent}>
              <View>
                <View style={styles.totalMoneyComponent}>
                  <Text style={styles.totalMoneyText}>Total</Text>
                  <Text style={styles.transactionAmountText}>
                    ${transaction.total}
                  </Text>
                </View>
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                <View style={styles.transactionIdComponent}>
                  <Text style={styles.transactionIdText}>Transaction ID: </Text>
                  <Text style={styles.transactionRefNum}>
                    {transaction.ref_num}
                  </Text>
                </View>
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                <View style={styles.paymentMethodComponent}>
                  <Text style={styles.paymentMethodText}>Payment Method: </Text>
                  <Text style={styles.transactionPaymentMethod}>
                    Card - {transaction.payment_method ? (transaction.payment_method).split(":")[1] :
                      null}
                  </Text>
                </View>
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                <View style={styles.subtotalComponent}>
                  <Text style={styles.subtotalText}>Subtotal</Text>
                  <Text style={styles.transactionSubtotal}>${transaction.subtotal}</Text>
                </View>
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                <View style={styles.taxComponent}>
                  <Text style={styles.taxText}>Tax</Text>
                  <Text style={styles.transactionTax}>${transaction.tax}</Text>
                </View>
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                <View style={styles.dateComponent}>
                  <Text style={styles.dateText}>Date</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.transaction_date).toDateString()}
                  </Text>
                </View>
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                {
                  props.canRate ? <View style={styles.rateComponent}>
                    <Text style={styles.rateText}>Rate: </Text>
                    <IncrementDecrementComponent
                        value={rating}
                        units={rating > 1 ? " stars" : " star"}
                        onChangeIncrement={() => rating < 5 ? setRating(rating + 1) : null}
                        onChangeDecrement={() => rating > 1 ? setRating(rating - 1) : null}
                    />
                    <TouchableOpacity onPress={() => {
                      rateTutor(transaction.tutor_id, rating);
                      Alert.alert("Success", "Sent rating, thanks for supporting!")
                    }}>
                      <View style={styles.serviceTagComponent}>
                        <Text style={styles.serviceTag}>Submit</Text>
                      </View>
                    </TouchableOpacity>
                  </View> : null
                }
                <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginLeft: "5%",
                      marginRight: "5%",
                    }}
                />
                <View style={styles.transactionTagsComponent}>
                  <Text style={styles.serviceTagsText}>Service Tags:</Text>
                  <View style={styles.serviceTagComponent}>
                    <Text style={styles.serviceTag}>{transaction.service_tag}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animatable.View>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer:{
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonClose: {
    backgroundColor: "black",
    borderRadius: 20,
    padding: 4,
    alignSelf: "flex-end",
  },
  tutorInfoComponent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  name: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginLeft: responsiveWidth(2),
  },

  transactionInfoComponent: {
    marginTop: responsiveHeight(4),
    flexDirection: "column",
    marginLeft: "5%",
    marginRight: "5%",
  },

  totalMoneyComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  totalMoneyText: {
    fontSize: responsiveFontSize(2.5),
    letterSpacing: 0.5,
  },
  transactionAmountText: {
    fontSize: responsiveFontSize(2.5),
  },
  transactionIdComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  transactionIdText: {
    fontSize: responsiveFontSize(2),
    letterSpacing: 0.5,
  },
  transactionRefNum: {
    flex: 2,
    fontSize: responsiveFontSize(2),
  },
  paymentMethodComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  paymentMethodText: {
    fontSize: responsiveFontSize(2),
    letterSpacing: 0.5,
  },
  transactionPaymentMethod: {
    fontSize: responsiveFontSize(2),
  },
  subtotalComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  subtotalText: {
    fontSize: responsiveFontSize(2),
    letterSpacing: 0.5,
  },
  transactionSubtotal: {
    fontSize: responsiveFontSize(2),
  },
  taxComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  taxText: {
    fontSize: responsiveFontSize(2),
  },
  transactionTax: {
    fontSize: responsiveFontSize(2),
  },
  dateComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  dateText: {
    fontSize: responsiveFontSize(2),
    letterSpacing: 0.5,
  },
  transactionDate: {
    fontSize: responsiveFontSize(2),
  },
  rateComponent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  rateText: {
    fontSize: responsiveFontSize(2.3),
    letterSpacing: 0.5,
  },
  transactionTagsComponent: {
    flexDirection: "column",
    padding:8,
    justifyContent: "space-between"
  },
  serviceTagsText: {
    fontSize: responsiveFontSize(2.5),
    marginBottom: responsiveHeight(1),
    letterSpacing: 0.5,
  },
  serviceTagComponent: {
    alignSelf: "baseline",
    backgroundColor: "green",
    padding: 8,
    borderRadius: 10,
  },
  serviceTag: {
    fontSize: responsiveFontSize(1.5),
    color: "white",
    letterSpacing: 0.5,
  },
});

export default ReceiptModal;