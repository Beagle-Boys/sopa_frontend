import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./styles";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { FadeInUp } from "react-native-reanimated";

const Premium = () => {
  return (
    <Animated.ScrollView entering={FadeInUp}>
      <View style={{backgroundColor: "#88bde5", display: "flex", alignItems: "center", height: 350, justifyContent: "space-evenly"}}>
        <Text style={{fontSize: 35, color: "#ddd", marginVertical: 20}}>You are a PRO</Text>
        <View>
        <Text style={{fontSize: 18, color: "#eee", marginBottom: 3}}>• Get Personalized Recommendations</Text>
        <Text style={{fontSize: 18, color: "#eee", marginBottom: 3}}>• Unlock more search results</Text>
        </View>
      <Pressable style={{backgroundColor: "#eee", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginVertical: 10}} onPress={async () => {
                    let receipt;
                    var options = {
                        description: "A Parking Solution",
                        image: "https://i.imgur.com/3g7nmJC.png",
                        currency: "INR",
                        key: "rzp_test_fsOZ42zZVgdCIZ",
                        amount: "5000",
                        name: "SOPA",
                        order_id: "order_DslnoIgkIDL8Zt", //Replace this with an order_id created using Orders API.
                        prefill: {
                            email: "",
                            contact: "",
                            name: "",
                        },
                        theme: { color: "#53a20e" },
                    };
                    await user_initiate_premium().then((r) => {
                        console.log("Response from initiate premium ->");
                        console.log(r);
                        options.amount = r.amount;
                        options.order_id = r.order_id;
                        options.prefill.email = user.email;
                        options.prefill.contact = user.mobile;
                        options.prefill.name = user.userName;
                        receipt = r.receipt;
                    });
                    console.log(options);
                    console.log("Receipt : " + receipt);
                    RazorpayCheckout.open(options)
                        .then((data) => {
                            console.log(":::::::::::::::");
                            console.log(data);
                            // handle success
                            alert(`Success: ${data.razorpay_payment_id}`);
                            user_complete_premium({
                                razorpay_payment_id: data.razorpay_payment_id,
                                razorpay_order_id: data.razorpay_order_id,
                                razorpay_signature: data.razorpay_signature,
                                receipt,
                            })
                                .then((d) => {
                                    console.log(d);
                                })
                                .catch(console.log);
                        })
                        .catch((error) => {
                            // handle failure
                            console.log(`Error: ${error.code} | ${error.description}`);
                        });
                }}>
        <Text>
          Extend Pro for 1 month
        </Text>
      </Pressable>
      </View>

      <View style={{backgroundColor: "#fff", display: "flex", alignItems: "center", height: "auto", justifyContent: "space-around"}}>
        <Text style={{fontSize: 35, color: "#444", marginVertical: 20}}>How to earn Karma</Text>
        <View>
        <Text style={{fontSize: 18, color: "#444", marginBottom: 3}}>• Get Personalized Recommendations</Text>
        <Text style={{fontSize: 18, color: "#444", marginBottom: 3}}>• Unlock more search results</Text>
        </View>
      </View>

    </Animated.ScrollView>
  );
};

export default Premium;
