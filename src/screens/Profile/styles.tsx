import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
    padding: 20,
    fontSize: 30,
    marginVertical: 20,
  },
  signUpTitle: {
    // flex: 1,
    fontSize: width / 7,
    // textAlignVertical: "center",
    marginBottom: 50,
    color: "white",
  },
  form: {
    backgroundColor: "#fff",
    width: width * 0.9,
    padding: "10%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: width / 18,
  },
  inpGroup: {
    marginVertical: 5,
  },
  sameLine: {
    paddingHorizontal: "5%",
    flexDirection: "row",
  },
  textInp: {
    // borderBottomWidth: 1,
    fontSize: width / 20,
    textAlignVertical: "center",
    // flexGrow: 1,
    width: "100%",
  },
  labelNum: {
    fontSize: width / 20,
    textAlign: "center",
    textAlignVertical: "center",
  },
  errorBox: {
    color: "red",
    backgroundColor: "#fcc",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 10,
    fontSize: width / 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 10,
    opacity: 0.6,
  },
  submitBtn: {
    backgroundColor: "#004e92cc",
    padding: 10,
  },
  submitBtnText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: width / 20,
    fontWeight: "600",
    padding: 10,
    color: "white",
  },
  profileLabel: {
    fontSize: 24,
  },
});

export default styles;
