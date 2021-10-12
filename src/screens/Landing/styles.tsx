import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'space-around',
        width: width
    },
    signUpTitle: {
        height: "100%",
        fontSize: 60,
        textAlignVertical: 'center',
    },
    submitBtn: {
        // backgroundColor: '#004e92',
        width: width - 30,
        marginVertical: 10,
    },
    submitBtnText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: width/20,
        fontWeight: "600",
        padding: 10,
        color: 'white'
    }
});

export default styles;