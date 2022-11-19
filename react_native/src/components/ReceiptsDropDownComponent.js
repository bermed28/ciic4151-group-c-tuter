import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import ReceiptsCardComponent from "./ReceiptsCardComponent";

function ReceiptsDropDownComponent(props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(-1);

  const renderLabel = (item) => {
    return <ReceiptsCardComponent item={item} />;
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setSelected(item.id);
        }}
      >
        {renderLabel(item)}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          height: 61,
          borderRadius: 10,
          marginLeft: 17,
          marginRight: 16,
          backgroundColor: "#ffffff",
          paddingLeft: "5%",
          justifyContent: "center",
        }}
        activeOpacity={1}
        onPress={() => setOpen(!open)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#666666" }}>View Receipts</Text>
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
      {open && (
        <View
          style={{
            position: "absolute",
            top: 70,
          }}
        >
          {props.data.map((item) => renderItem(item))}
        </View>
      )}
    </View>
  );
}

export default ReceiptsDropDownComponent;