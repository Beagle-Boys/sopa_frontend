import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { TextInput } from 'react-native-gesture-handler';
import { useFirebaseContext } from '../../context/FirebaseContext';
import axios from 'axios';

const PHONE_NUMBER_REGEX = /^\d{10}$/;

const SignUp = (props: any) => {

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [nameError, setNameError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setSopaToken, sopaToken } = useFirebaseContext();

    async function onSubmit() {
        setIsSubmitting(true);
        console.log(name, mobile);
        let valid = validate();
        let otpId = "";
        if (valid) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const data = JSON.stringify({
                userName: name, countryCode: '91', mobileNumber: mobile, email: "a@a.com",
                imageUrl: "",
                isActive: false
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: data,
            };
            try {
                let result = await fetch("https://sopa-bff.herokuapp.com/user/register/mobile", requestOptions);
                let res = await result.json();
                otpId = res.otpId;
            } catch (error) {
                console.log(error);
            }
            // axios.post('https://sopa-bff.herokuapp.com/user/register/mobile',
            //     JSON.stringify({
            //         userName: name, countryCode: '91', mobileNumber: mobile, email: "a@a.com",
            //         imageUrl: "",
            //         isActive: false
            //     }),
            //     { headers: { 'Content-Type': 'application/json' } }
            // )
            //     .then(res => otpId = res.data.otpId)
            //     .catch(err => console.log(err))
            Alert.alert('Success', `You have successfully signed up : ${name} ${mobile}`);
            requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ otpId: otpId, otp: '1234', mobile }),
            }
            let result = await fetch(`https://sopa-bff.herokuapp.com/user/register/otp/validate`, requestOptions);
            let res = await result.json();
            setSopaToken(res.auth);
            // axios.post('https://sopa-bff.herokuapp.com/user/register/otp/validate',
            //     JSON.stringify({
            //         otpId,
            //         otp: "1234",
            //         mobile: "8789687725"
            //     }),
            //     { headers: { 'Content-Type': 'application/json' } }
            // )
            //     .then(res =>
            //         setSopaToken(res.data.auth))
            //     .catch(err => console.log(err));
        }
        setIsSubmitting(false);
    }

    useEffect(() => {
        console.log(sopaToken);
    }, [sopaToken])

    function validate() {
        let isValid = true;
        if (name.length < 3) {
            setNameError("Name must be atleast 3 characters long");
            isValid = false;
        } else if (name.length > 20) {
            setNameError("Name must be less than 20 characters long");
            isValid = false;
        }
        else {
            setNameError("");
        }
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
            <Text style={styles.signUpTitle}>Sign Up</Text>
            <SafeAreaView style={{ flex: 3 }}>
                <View style={styles.form}>

                    <View style={styles.inpGroup}>
                        <Text style={styles.labelText}>Name</Text>
                        <TextInput style={styles.textInp} value={name} onChangeText={setName} keyboardType="name-phone-pad" defaultValue="Your Name" autoCompleteType="name" />
                        {nameError !== "" ? <Text style={styles.errorBox} >{nameError}</Text> : null}
                    </View>
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
                            <Text style={styles.submitBtnText} >Submit</Text>
                        </Pressable>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    )
}

export default SignUp;