import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DropdownComponent = ({setDepartment}) => {
    const [value, setValue] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        axios.get("http://192.168.1.249:8080/tuter/all-depts/", {headers: {'Content-Type': 'application/json'}}).then(
            (response) => {
                let count = response.data.departments.length;
                let departmentArray = [];
                for (let i = 0; i < count; i++) {
                    departmentArray.push({label: response.data.departments[i], value: response.data.departments[i]})
                }
                setDepartments(departmentArray);
            });
    }, []);

    useEffect(() => {
        async function fetchUser() {
            try {
                await AsyncStorage.getItem("user").then(user => {
                    // console.log(`Fetched User: ${user}`);
                    setUserInfo(JSON.parse(user));
                }).catch(err => {
                    console.log(err)
                });
            } catch (e) {
                console.log(e);
            }
        }
        fetchUser();
    }, [])
    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={departments}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus && userInfo ? userInfo.department : '...'}
                // placeholder={!isFocus ? "Change Department" : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setDepartment(item.value);
                    setIsFocus(false);
                }}
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 5,
    },
    action: {
        flexDirection: "row",
        height: 44,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#000000",
        padding: 5,
        paddingRight: 5,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
        shadowColor: "rgba(0,0,0,0.75)"
    },
    dropdown: {
        height: 44,
        borderColor: "#000000",
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "rgba(0,0,0,0.45)"
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});