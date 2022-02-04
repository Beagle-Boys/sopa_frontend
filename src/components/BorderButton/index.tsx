import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { height, width } = Dimensions.get("screen");

interface BorderButtonProps {
  onPress: () => void;
  body: String;
  spinnerAnimation?: boolean;
  disabled?: boolean;
}

const BorderButton = (props: BorderButtonProps) => {
  const [pressedB, setPressedB] = useState(false);
  return (
    <Pressable
      onPressIn={() => setPressedB(true)}
      onPressOut={() => setPressedB(false)}
      style={({ pressed }) => [
        {
          backgroundColor:
            pressed && (!props.disabled || false) ? "#008081" : "#fff",
        },
        styles.submitBtn,
        props.disabled ? { borderColor: "#aaa" } : null,
      ]}
      onPress={props.onPress}
      disabled={props.disabled || false}
    >
      {props?.spinnerAnimation ? (
        <ActivityIndicator size={44} color="#008081" />
      ) : (
        <Text
          style={[
            styles.submitBtnText,
            pressedB ? { color: "#fff" } : { color: "#008081" },
            props.disabled ? { color: "#ccc" } : null,
          ]}
        >
          {props.body}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  submitBtnText: {
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    fontSize: width / 20,
    fontWeight: "600",
    padding: 10,
    color: "#070",
  },
  submitBtn: {
    // backgroundColor: '#004e92',
    width: 0.6 * width,
    marginVertical: 10,
    borderRadius: 20,
    borderColor: "#008081",
    borderWidth: 2,
  },
});

export default BorderButton;
