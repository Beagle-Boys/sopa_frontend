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
    height: 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: "3%",
  },
  searchBarPos: {
    width: "90%",
    position: "absolute",
    top: "3%",
    shadowOffset: {
      width: 0,
      height: -100,
    },
    elevation: 2,
    zIndex: 2,
    alignSelf: "center",
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
