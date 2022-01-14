import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Animated,
} from "react-native";
import styles from "./styles";
import { TextInput } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/AuthContext";
const PHONE_NUMBER_REGEX = /^\d{10}$/;

const SignIn = (props: any) => {
  const [mobile, setMobile] = useState("");
  const [otpId, setOtpId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <View style={styles.container}>
      <Text>Sign In</Text>
    </View>
  );
};

const EnterOTP = (props: any) => {
  const [otpValue, setotpValue] = useState("");
  const [otp, setOtp] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  function onSubmit() {}

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.inpGroup}>
        <Text style={styles.labelText}>Enter OTP</Text>
        <TextInput
          style={styles.textInp}
          value={otpValue}
          onChangeText={setotpValue}
          keyboardType="phone-pad"
          defaultValue="xxxxxxxxxx"
          autoCompleteType="tel"
        />
      </View>
      <View style={styles.inpGroup}>
        <Pressable style={styles.submitBtn} onPress={onSubmit}>
          {otp ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Verify</Text>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default SignIn;
