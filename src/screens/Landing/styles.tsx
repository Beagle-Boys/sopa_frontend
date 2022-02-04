import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  signUpTitle: {
    // height: "100%",
    fontSize: 60,
    textAlignVertical: "center",
  },
  submitBtn: {
    // backgroundColor: '#004e92',
    width: 0.6 * width,
    marginVertical: 10,
    borderRadius: 20,
    borderColor: "#070",
    borderWidth: 2,
  },
  submitBtnText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: width / 20,
    fontWeight: "600",
    padding: 10,
    color: "#070",
  },
});

export default styles;
