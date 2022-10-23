import Feather from "react-native-vector-icons/Feather";
import {Platform, StyleSheet, TextInput, View} from "react-native";
import React from "react";

function SearchBarComponent(props){
    return (
        <View style={props.style}>
            <Feather name="search" color={"#696969"} size={20} style={{paddingTop: 12, paddingRight: 5}}/>
            <TextInput
                autoCapitalize={'none'}
                placeholder={"Search"}
                clearButtonMode={"while-editing"}
                placeholderTextColor={"rgba(0,0,0,0.45)"}
                style={[styles.textInput]}
                onChangeText={props.onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        color: "#05375a"
    },
})

export default SearchBarComponent;