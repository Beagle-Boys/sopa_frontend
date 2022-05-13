import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
    padding: 20,
    fontSize: 30,
    marginVertical: 20,
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
    fontSize: width / 20,
    width: 0.8 * width,
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
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
    backgroundColor: "#008081",
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
    justifyContent: "space-evenly",
    margin: 40,
    width: width * 0.8,
  },
});

export default styles;
