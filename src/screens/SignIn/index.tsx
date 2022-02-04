import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Animated,
  SafeAreaView,
} from "react-native";
import styles from "./styles";
import { TextInput } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/AuthContext";
import * as yup from "yup";
import { Formik } from "formik";
import SvgUri from "react-native-svg-uri";
import BorderButton from "../../components/BorderButton";

const PHONE_NUMBER_REGEX = /^\d{10}$/;

const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters long")
    .required("Username is Required"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email Address is Required"),
  mobile: yup
    .string()
    .matches(PHONE_NUMBER_REGEX, "Phone number is not valid")
    .required("Password is required"),
});

const SignIn = (props: any) => {
  const [mobile, setMobile] = useState("");
  const [otpId, setOtpId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuthContext();

  // useEffect(() => { otpId != '' ? console.log(otpId) : null }, [otpId])

  async function onSubmit(formdata: {
    username: string;
    email: string;
    mobile: string;
  }) {
    // console.log(formdata);
    setMobile(formdata.mobile);
    try {
      const otp = await login(formdata.mobile, "91");
      // console.log(otp);
      setOtpId(otp);
      setIsSubmitting(true);
    } catch (e) {
      console.log(e);
    }
    // api_login({
    //         "userName": formdata.username,
    //         "countryCode": "91",
    //         "mobile": formdata.mobile,
    //         "googleId": "",
    //         "email": formdata.email,
    //         "imageUrl": "",
    //         "isActive": false
    //     })
    //     .then(res => {
    //         console.log(res);
    //         setOtpId(res.data.otpId); setIsSubmitting(true);
    //     })
    //     .catch(err => console.log(err.response));
  }

  return (
    <>
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#008081" }}></View>
        <View style={{ flex: 1 }}></View>
      </View>

      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            elevation: 2,
            padding: 10,
          }}
        >
          <SvgUri
            source={require("./../../../assets/images/Icon_raw.svg")}
            height={70}
            width={70}
//             svgXmlData='<svg width="834" height="805" viewBox="0 0 834 805" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Icon_raw">
// <g id="bub3" style="mix-blend-mode:darken">
// <circle cx="258.5" cy="546.5" r="258.5" fill="#8433EC"/>
// </g>
// <g id="bub2" style="mix-blend-mode:darken">
// <circle cx="575.5" cy="546.5" r="258.5" fill="#6177EF"/>
// </g>
// <g id="bub1" style="mix-blend-mode:darken">
// <path d="M686 258.5C686 401.266 570.266 517 427.5 517C284.734 517 169 401.266 169 258.5C169 115.734 284.734 0 427.5 0C570.266 0 686 115.734 686 258.5Z" fill="#946FC4"/>
// </g>
// </g>
// </svg>'
          />
        </View>
        <Text style={styles.signUpTitle}>Sign In</Text>
        <SafeAreaView style={{}}>
          <View style={styles.form}>
            {!isSubmitting ? (
              <>
                <Formik
                  initialValues={{ username: "", email: "", mobile: "" }}
                  onSubmit={(values) => onSubmit(values)}
                  validationSchema={loginValidationSchema}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isValid,
                  }) => (
                    <>
                      <TextInput
                        placeholder="Username"
                        style={styles.textInp}
                        onChangeText={handleChange("username")}
                        value={values.username}
                      />
                      {errors.username && touched.username && (
                        <Text style={styles.errorBox}>{errors.username}</Text>
                      )}
                      <TextInput
                        placeholder="Email"
                        style={styles.textInp}
                        onChangeText={handleChange("email")}
                        value={values.email}
                        keyboardType="email-address"
                      />
                      {errors.email && touched.email && (
                        <Text style={styles.errorBox}>{errors.email}</Text>
                      )}
                      <View style={styles.sameLine}>
                        <Text style={styles.labelNum}>+91</Text>
                        <TextInput
                          placeholder="mobile"
                          style={styles.textInp}
                          onChangeText={handleChange("mobile")}
                          value={values.mobile}
                          keyboardType="numeric"
                        />
                      </View>
                      {errors.mobile && touched.mobile && (
                        <Text style={styles.errorBox}>{errors.mobile}</Text>
                      )}
                      <BorderButton
                        onPress={handleSubmit}
                        body="Get OTP"
                        disabled={!isValid}
                      />
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
              </>
            ) : (
              <EnterOTP otpId={otpId} mobile={mobile} />
            )}
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

const EnterOTP = (props: any) => {
  const [otpValue, setotpValue] = useState("");
  const [otp, setOtp] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { validate_login } = useAuthContext();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  async function onSubmit() {
    if (otpValue.length == 4) {
      // console.log(props.otpId, otpValue);
      validate_login(otpValue, props.mobile, props.otpId).catch((e) =>
        console.log(e)
      );
      setOtp(true);
    }
    setotpValue("");
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.inpGroup}>
        <TextInput
          placeholder="Enter OTP"
          style={styles.textInp}
          value={otpValue}
          onChangeText={setotpValue}
          keyboardType="phone-pad"
          defaultValue="xxxxxxxxxx"
          autoCompleteType="tel"
        />
      </View>
      <View style={styles.inpGroup}>
        <BorderButton
          onPress={onSubmit}
          body="Verify"
          spinnerAnimation={otp}
          disabled={otpValue.length != 4}
        />
      </View>
    </Animated.View>
  );
};

export default SignIn;
