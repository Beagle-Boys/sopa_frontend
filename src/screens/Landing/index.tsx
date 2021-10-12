import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./styles";

const Landing = (props: any) => {
    return (
        <View style={styles.container}>
            <View style={{ flex: 2 }}>
                <Text style={styles.signUpTitle}>Welcome</Text>
            </View>
            <View style={{ flex: 3, justifyContent: "center", marginTop: -100 }}>
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? "#000428" : "#004e92",
                        },
                        styles.submitBtn,
                    ]}
                    onPress={()=> {
                        props.navigation.navigate('SignUp')
                    }}>
                    <Text style={styles.submitBtnText}>Sign Up</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? "#000428" : "#004e92",
                        },
                        styles.submitBtn,
                    ]}
                    onPress={() => {
                        props.navigation.navigate('SignIn')
                    }}>
                    <Text style={styles.submitBtnText}>Sign In</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Landing;
