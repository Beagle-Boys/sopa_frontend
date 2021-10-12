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
        flex: 1,
        fontSize: width/7,
        textAlignVertical: 'center',
    },
    form: {
        width: width,
        padding: "10%",
    },
    labelText: {
        fontSize: width/18,
    },
    inpGroup: {
        marginVertical: 5
    },
    sameLine: {
        flexDirection: 'row',
    },
    textInp: {
        borderBottomWidth: 1,
        fontSize: width/20,
        textAlignVertical: 'center',
        flexGrow: 1,
    },
    labelNum: {
        fontSize: width/20,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    errorBox: {
        color: 'red',
        backgroundColor: '#fcc',
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 10,
        fontSize: width/20,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginTop: 10,
        opacity: 0.6
    }
});

export default styles;