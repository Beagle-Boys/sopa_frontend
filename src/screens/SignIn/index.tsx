import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Pressable, Animated, TouchableNativeFeedbackBase } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { TextInput } from 'react-native-gesture-handler';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import * as yup from 'yup';
import { Formik } from 'formik';

const PHONE_NUMBER_REGEX = /^\d{10}$/;

const loginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be less than 20 characters long')
        .required('Username is Required'),
    email: yup
        .string()
        .email("Please enter valid email")
        .required('Email Address is Required'),
    mobile: yup
        .string()
        .matches(PHONE_NUMBER_REGEX, 'Phone number is not valid')
        .required('Password is required'),
})

const SignIn = (props: any) => {

    const [mobile, setMobile] = useState("");
    const [otpId, setOtpId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { } = useAuthContext();

    // useEffect(() => { otpId != '' ? console.log(otpId) : null }, [otpId])

    function onSubmit(formdata: { username: string, email: string, mobile: string }) {
        console.log(formdata);
        setMobile(formdata.mobile);
        axios.post('https://sopa-bff.herokuapp.com/user/login/mobile',
            {
                "userName": formdata.username,
                "countryCode": "91",
                "mobile": formdata.mobile,
                "googleId": "",
                "email": formdata.email,
                "imageUrl": "",
                "isActive": false
            },
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(res => {
                console.log(res.data.otpId);
                setOtpId(res.data.otpId); setIsSubmitting(true);
            })
            .catch(err => console.log(err.response));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.signUpTitle}>Sign In</Text>
            <SafeAreaView style={{ flex: 3 }}>
                <View style={styles.form}>
                    {!isSubmitting ?
                        <>
                            <Formik
                                initialValues={{ username: '', email: '', mobile: '' }}
                                onSubmit={values => onSubmit(values)}
                                validationSchema={loginValidationSchema}
                            >
                                {({ handleChange, handleSubmit, values, errors, touched, isValid }) => (
                                    <>
                                        <TextInput
                                            placeholder="Username"
                                            style={styles.textInp}
                                            onChangeText={handleChange('username')}
                                            value={values.username}
                                        />
                                        {(errors.username && touched.username) &&
                                            <Text style={styles.errorBox}>{errors.username}</Text>
                                        }
                                        <TextInput
                                            placeholder="Email"
                                            style={styles.textInp}
                                            onChangeText={handleChange('email')}
                                            value={values.email}
                                            keyboardType="email-address"
                                        />
                                        {(errors.email && touched.email) &&
                                            <Text style={styles.errorBox}>{errors.email}</Text>
                                        }
                                        <View style={styles.sameLine}>
                                            <Text style={styles.labelNum}>+91</Text>
                                            <TextInput
                                                placeholder="mobile"
                                                style={styles.textInp}
                                                onChangeText={handleChange('mobile')}
                                                value={values.mobile}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {(errors.mobile && touched.mobile) &&
                                            <Text style={styles.errorBox}>{errors.mobile}</Text>
                                        }
                                        <Pressable onPress={handleSubmit} style={[styles.submitBtn, styles.inpGroup, !isValid ? {backgroundColor: "#ccc"} : null]} disabled={!isValid}>
                                            <Text style={styles.submitBtnText}>Get OTP</Text>
                                        </Pressable>
                                    </>
                                )}
                            </Formik>
                            {/* <View style={styles.inpGroup}>
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
                            </View> */}
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

    const { auth, setAuth } = useAuthContext();
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
        if (otpValue.length == 4) {
            console.log(props.otpId, otpValue);
            axios.post('https://sopa-bff.herokuapp.com/user/login/otp/validate',
                {
                    "otpId": props.otpId,
                    "otp": otpValue,
                    "mobile": props.mobile
                },
                { headers: { 'Content-Type': 'application/json' } }
            )
                .then(res => {
                    console.log(res.data);
                    setOtp(true);
                    setAuth(res.data.auth);
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