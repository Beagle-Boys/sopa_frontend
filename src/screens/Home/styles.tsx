import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "space-around",
    // backgroundColor: "#AFE1AF",
    flexGrow: 1,
  },
  searchBar: {
    width: "90%",
    height: 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: "3%",
    // marginTop: "3%",
    alignSelf: "center",
    shadowOffset: {
      width: 0,
      height: -100,
    },
    elevation: 10,
    zIndex: 2,
  },
  menuBtn: {
    padding: 10,
    // backgroundColor: "#ccc",
  },
  searchInput: {
    flexGrow: 1,
    fontSize: 20,
  },
});

export default styles;
