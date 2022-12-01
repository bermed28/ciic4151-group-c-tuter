import React, {useEffect, useState} from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable-unmountable";
import paw from "../../../assets/images/paw.png";
import ReceiptsCardComponent from "../../components/ReceiptsCardComponent";
import Feather from "react-native-vector-icons/Feather";
import ReceiptModal from "../../components/ReceiptModalComponent";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ReceiptsScreenComponent() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [paddingBottom, setPaddingbottom] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = React.useState(-1);
  const [openModal, setOpenModal] = useState(false);
  const [receipts, setReceipts] = React.useState([]);


  const toggleModal = () => {setOpenModal(!openModal)}
  const toggleDropdown = () => {setOpen(!open)};

  useEffect(() => {
    open ? setPaddingbottom(responsiveHeight(90)) : setPaddingbottom(0);
  }, [open]);

  useEffect(() => {
    async function fetchUser(){
      try {
        await AsyncStorage.getItem("user").then(user => {
          setLoggedInUser(JSON.parse(user));
        }).catch(err => {
          console.log(err)
        });
      } catch(e) {
        console.log(e);
      }
    }
    fetchUser();
  }, []);

  useEffect( () => {
    async function fetchReceipts() {
      try {
        await axios.post(`https://tuter-app.herokuapp.com/tuter/transaction-receipt`,
            {user_id: loggedInUser.user_id},
            {headers: {'Content-Type': 'application/json'}})
            .then((response) => {
              setReceipts(response.data);
            })
      } catch (e) {
        console.log(e)
      }
    }
    fetchReceipts();
  }, [loggedInUser]);

  return (
      <View>
        {<ReceiptModal visible={openModal} closeModal={toggleModal} receipt={selectedReceipt}/>}
        {/*Tuter*/}
        <View style={[styles.title, { flexDirection: "row" }]}>
          <Text style={styles.tuter}> Tüter </Text>
          {/*paw*/}
          <Image source={paw} style={styles.paw} resizeMode={"contain"} />
          {/*slogan*/}
          <Text style={styles.slogan}> Find a capable tutor, anytime </Text>
        </View>

        <Text style={{
          top: responsiveHeight(1.5),
          marginLeft: responsiveWidth(5),
          fontSize: responsiveFontSize(3),
          fontWeight: "bold",
          color: "white"
        }}>
          Recent Transactions
        </Text>

        <View style={{paddingTop: responsiveHeight(3), paddingBottom: responsiveHeight(1)}}>
          <TouchableOpacity
              style={{
                height: responsiveHeight(6.5),
                borderRadius: 10,
                marginLeft: 17,
                marginRight: 16,
                backgroundColor: "#ffffff",
                paddingLeft: "5%",
                justifyContent: "center",
              }}
              activeOpacity={1}
              onPress={toggleDropdown}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#666666" }}>
                View Receipts
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
        </View>

        <ScrollView style={{flexGrow: 1, paddingBottom: paddingBottom}}>
          {/* View Receipts Cards */}
          <View>
            <Animatable.View
                mounted={open}
                animation={"fadeInUpBig"}
                unmountAnimation={'fadeOutDownBig'}
                style={{
                  position: "absolute"
                }}>
              {
                receipts.map((item, index) => {
                  return (
                      <TouchableOpacity
                          key={index}
                          activeOpacity={1}
                          onPress={() => {
                            setSelectedReceipt(item);
                            toggleModal();
                          }}
                      >
                        <ReceiptsCardComponent key={index} receipt={item} />
                      </TouchableOpacity>
                  );
                })}
            </Animatable.View>
          </View>
        </ScrollView>
      </View>

  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: responsiveScreenHeight(5),
    marginLeft: responsiveScreenWidth(3),
    width: "95%",

    padding: "2%",
  },
  tuter: {
    color: "white",
    fontSize: responsiveFontSize(5),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  paw: {
    marginTop: responsiveScreenHeight(-2),
    marginLeft: responsiveScreenWidth(-35),
    height: responsiveScreenHeight(3),
  },
  slogan: {
    color: "white",
    fontSize: responsiveFontSize(1.5),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
});
export default ReceiptsScreenComponent;