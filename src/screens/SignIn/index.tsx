import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { TextInput } from 'react-native-gesture-handler';
import { useFirebaseContext } from '../../context/FirebaseContext';
import axios from 'axios';

const PHONE_NUMBER_REGEX = /^\d{10}$/;

const SignIn = (props: any) => {

    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [otpId, setOtpId] = useState("");

    const { } = useFirebaseContext();

    function onSubmit() {
        if(validate()) {
            axios.post('https://sopa-bff.herokuapp.com/user/login/mobile',
            {
                    userName: "anurag", countryCode: '91', mobileNumber: mobile, email: "a@a.com",
                    imageUrl: "",
                    isActive: false
                },
                {headers: {'Content-Type': 'application/json'}}
            )
            .then(res => setOtpId(res.data.otpId))
            .catch(err => console.log(err));
            setIsSubmitting(true);
        }
        setMobile("");
    }

    function validate() {
        let isValid = true;
        if (!PHONE_NUMBER_REGEX.test(mobile)) {
            setMobileError("Invalid Phone number");
            isValid = false;
        } else {
            setMobileError("");
        }
        return isValid;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.signUpTitle}>Sign In</Text>
            <SafeAreaView style={{ flex: 3 }}>
                <View style={styles.form}>
                    {!isSubmitting ?
                        <>
                            <View style={styles.inpGroup}>
                                <Text style={styles.labelText}>Mobile Number</Text>
                                <View style={styles.sameLine}>
                                    <Text style={styles.labelNum}>+91</Text>
                                    <TextInput style={styles.textInp} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" defaultValue="xxxxxxxxxx" autoCompleteType="tel" />
                                </View>
                                {mobileError !== "" ? <Text style={styles.errorBox} >{mobileError}</Text> : null}
                            </View>
                            <View style={styles.inpGroup}>
                                <Pressable style={styles.submitBtn} disabled={isSubmitting} onPress={onSubmit}>
                                    <Text style={styles.submitBtnText}>Get OTP</Text>
                                </Pressable>
                            </View>
                        </> :
                        <EnterOTP otpId={otpId} mobile={mobile} />
                    }
                </View>
            </SafeAreaView>
        </View>
    )
}

const EnterOTP = (props: any) => {
    const [otpValue, setotpValue] = useState("")
    const [otp, setOtp] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current

    const { setWhat, setSopaToken } = useFirebaseContext();
    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }, [fadeAnim])

    function onSubmit() {
        if(otpValue.length == 4) {
            axios.post('https://sopa-bff.herokuapp.com/user/login/otp/validate',
            {
                otpId: props.otpId,
                otp: otpValue,
                mobile: props.mobile
            },
            {headers: {'Content-Type': 'application/json'}}
            )
            .then(res => {
                if(res.data.success) {
                    console.log(res.data);
                    setWhat("home");
                    setOtp(true);
                    setSopaToken(res.data.auth);
                }
            })
            .catch(err => console.log(err));
        }
        setotpValue("");
    }

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.inpGroup}>
                <Text style={styles.labelText}>Enter OTP</Text>
                <TextInput style={styles.textInp} value={otpValue} onChangeText={setotpValue} keyboardType="phone-pad" defaultValue="xxxxxxxxxx" autoCompleteType="tel" />
            </View>
            <View style={styles.inpGroup}>
                <Pressable style={styles.submitBtn} onPress={onSubmit}>
                    {otp ? <ActivityIndicator size="large" color="#fff" /> : <Text style={styles.submitBtnText}>Verify</Text>}
                </Pressable>
            </View>
        </Animated.View>
    )
}

export default SignIn;