import React, { useState, createRef } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { useAuthContext } from "../../context/AuthContext";

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
    console.log('GETTING OTP ID');
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
    <SafeAreaView>
      <View>
        <Text>Registration</Text>
        <View>
          <TextInput
            placeholder="User Name"
            returnKeyType="next"
            editable={!otpId}
            onChangeText={setName}
            onSubmitEditing={editNextInput}
            ref={nameInputRef}
          >
            {nameError ? <Text>{nameError}</Text> : null}
          </TextInput>
        </View>
        <View>
          <Text>+91</Text>
          <TextInput
            placeholder="Mobile"
            returnKeyType="next"
            maxLength={10}
            editable={!otpId}
            onChangeText={setMobile}
            onSubmitEditing={editNextInput}
            ref={mobileInputRef}
          >
            {mobileError ? <Text>{mobileError}</Text> : null}
          </TextInput>
        </View>
        {otpId.length > 0 ? (
          <>
            <View>
              <TextInput placeholder="OTP" maxLength={4} onChangeText={setOtp}>
                {otpError && <Text>{otpError}</Text>}
              </TextInput>
            </View>
            <View>
              <Button title="Reset" onPress={() => setOtpId("")} />
            </View>
          </>
        ) : null}
        <View>
          <Button
            disabled={
              isLoading || (otpId ? otp.length != 4 : mobile.length != 10 || name.length < 3)
            }
            title="Sign In"
            onPress={otpId ? validate_otp : getOtpId}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
