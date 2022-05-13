import React, { useState, createRef } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { useAuthContext } from "../../context/AuthContext";
import SvgUri from "react-native-svg-uri";
import BorderButton from "../../components/BorderButton";

const PHONE_NUMBER_REGEX = /^\d{10}$/;

const SignUp = (props: any) => {
  const nameInputRef = createRef<TextInput>();
  const mobileInputRef = createRef<TextInput>();

  const { register, validate_register } = useAuthContext();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");

  function getActiveInputIndex() {
    return inputs().findIndex((input) => {
      let current = input.current;
      if (!current) return false;
      console.log("input:", current);
      return current.isFocused();
    });
  }

  function getOtpId() {
    console.log("GETTING OTP ID");
    let valid = validate_register_params();
    console.log(valid);
    if (!valid) return;
    setIsLoading(true);
    register({
      userName: name,
      mobile,
      countryCode: "+91",
    })
      .then((id) => {
        setOtpId(id);
        console.log("otpid", otpId);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function validate_otp() {
    if (otp.length < 4) return;
    if (otpId.length < 4) return;
    if (mobile.length != 10) return;
    setIsLoading(true);
    validate_register(otp, mobile, otpId)
      .then(console.log)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function validate_register_params() {
    if (name.length < 3) {
      setNameError("Name must be at least 3 characters long");
      return false;
    }
    if (mobile.length < 10) {
      setMobileError("Mobile number must be at least 10 digits long");
      return false;
    }
    return true;
  }

  function inputs() {
    return [nameInputRef, mobileInputRef];
  }

  function setFocus(
    inputRef: React.RefObject<TextInput>,
    shouldFocus: boolean
  ) {
    if (inputRef?.current == null) return;
    if (shouldFocus) {
      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
      }, 100);
    } else {
      inputRef.current.blur();
    }
  }

  function finishEditing() {
    let activeIndex = getActiveInputIndex();
    if (activeIndex < 0) return;
    console.log("Finished Editing");
    setFocus(inputs[activeIndex], false);
    validate_register_params();
  }

  function editNextInput(e: any) {
    console.log("editNextInput");
    let activeIndex = getActiveInputIndex();
    if (activeIndex === -1) return;
    let nextIndex = activeIndex + 1;
    if (nextIndex < inputs().length && inputs()[nextIndex].current != null) {
      setFocus(inputs()[nextIndex], true);
    } else {
      finishEditing();
    }
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
            // source={require("./../../../assets/images/Icon_raw.svg")}
            height={70}
            width={70}
            svgXmlData='<svg width="834" height="805" viewBox="0 0 834 805" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Icon_raw">
<g id="bub3" style="mix-blend-mode:darken">
<circle cx="258.5" cy="546.5" r="258.5" fill="#8433EC"/>
</g>
<g id="bub2" style="mix-blend-mode:darken">
<circle cx="575.5" cy="546.5" r="258.5" fill="#6177EF"/>
</g>
<g id="bub1" style="mix-blend-mode:darken">
<path d="M686 258.5C686 401.266 570.266 517 427.5 517C284.734 517 169 401.266 169 258.5C169 115.734 284.734 0 427.5 0C570.266 0 686 115.734 686 258.5Z" fill="#946FC4"/>
</g>
</g>
</svg>'
          />
        </View>

        <Text style={styles.signUpTitle}>Registration</Text>
        <View style={styles.form}>
          {otpId.length == 0 && (
            <>
              <View style={styles.inpGroup}>
                <TextInput
                  placeholder="Username"
                  returnKeyType="next"
                  editable={!otpId}
                  onChangeText={setName}
                  onSubmitEditing={editNextInput}
                  ref={nameInputRef}
                  style={styles.textInp}
                >
                  {nameError ? <Text>{nameError}</Text> : null}
                </TextInput>
              </View>
              <View style={[styles.inpGroup, styles.sameLine]}>
                <Text style={styles.labelNum}>+91</Text>
                <TextInput
                  placeholder="Mobile"
                  returnKeyType="next"
                  maxLength={10}
                  editable={!otpId}
                  onChangeText={setMobile}
                  onSubmitEditing={editNextInput}
                  ref={mobileInputRef}
                  style={styles.textInp}
                >
                  {mobileError ? <Text>{mobileError}</Text> : null}
                </TextInput>
              </View>
            </>
          )}
          {otpId.length > 0 ? (
            <>
              <View>
                <TextInput
                  placeholder="OTP"
                  maxLength={4}
                  onChangeText={setOtp}
                  style={styles.textInp}
                >
                  {otpError && <Text>{otpError}</Text>}
                </TextInput>
              </View>
              {/* <View>
                <Button title="Reset" onPress={() => setOtpId("")} />
                </View> */}
            </>
          ) : null}
          <View
            style={[
              styles.inpGroup,
              {
                alignContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <BorderButton
              disabled={
                isLoading ||
                (otpId
                  ? otp.length != 4
                  : mobile.length != 10 || name.length < 3)
              }
              body={otpId.length > 0 ? "Sign In" : "Get OTP"}
              onPress={otpId ? validate_otp : getOtpId}
              spinnerAnimation={isLoading}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default SignUp;
