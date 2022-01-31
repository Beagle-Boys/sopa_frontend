import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
    padding: 20,
    fontSize: 30,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: 'space-around',
    width: width,
  },
  signUpTitle: {
    flex: 1,
    fontSize: width / 7,
    textAlignVertical: "center",
  },
  form: {
    width: width,
    padding: "10%",
  },
  labelText: {
    fontSize: width / 18,
  },
  inpGroup: {
    marginVertical: 5,
  },
  sameLine: {
    flexDirection: "row",
  },
  textInp: {
    borderBottomWidth: 1,
    fontSize: width / 20,
    textAlignVertical: "center",
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
    width,
    position: "absolute",
    bottom: 0,
  },
  submitBtnText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: width / 20,
    fontWeight: "600",
    padding: 10,
    color: "white",
  },
  radioForm: {
    justifyContent: "center",
    margin: 40,
  },
});

export default styles;
