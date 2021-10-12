import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around' 
    },
    appName: {
        fontSize: 10,
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 10,
    },
    appText: {
        fontSize: 25,
        textAlign: 'center',
        fontFamily: "RussoOne"
    }
});

export default styles;