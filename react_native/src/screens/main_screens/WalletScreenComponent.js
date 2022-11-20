import React, {useEffect, useState} from "react";
import {Alert, Button, ScrollView, Text, View} from "react-native";
import {StripeProvider, useStripe} from "@stripe/stripe-react-native";
import * as Animatable from "react-native-animatable-unmountable";

function WalletScreenComponent(){
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [isValid, setValid] = useState(false);
    const [total, setTotal] = useState(1999);
    let formdata = new FormData();
    formdata.append('total', total);


    const fetchPaymentSheetParams = async () => {
        const response = await fetch('http://192.168.1.9:8080/payment-sheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({total: total})
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            customFlow: false,
            merchantDisplayName: 'Stack Overflowers Inc.',
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
        });
        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            setValid(true); // The transaction was valid
            console.log('Transaction was successful');
        }
    };

    useEffect(() => {
        initializePaymentSheet().then(r => {});
    }, []);

    return (
        <StripeProvider
            publishableKey="pk_test_51M2zHJDhRypYPdkQRZ4Cd7KIu3idER1Fz9Je6KWv7xKDdG2OENqBADizHpdPUtGX1jrEtdKvTuYJSUIeNkoKIoeM00UiSHJiq2"
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems:"center", justifyContent: "center"}}>
                <Animatable.View animation={'fadeInUpBig'} >
                    <Text style={{alignItems: "center", justifyContent:"center"}}>Wallet Screen</Text>
                    <Button
                        variant="primary"
                        disabled={!loading}
                        title="Checkout"
                        onPress={openPaymentSheet}
                    />
                </Animatable.View>
            </ScrollView>
        </StripeProvider>
    );
}

export default WalletScreenComponent;