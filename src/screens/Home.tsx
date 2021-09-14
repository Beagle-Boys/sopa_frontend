import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import app from '@react-native-firebase/app';

const Home = (props: any) => {
    return(
        <View style={styles.container}>
            <View style={styles.appName}>
                <Text style={styles.appText}>
                    Firebase Project ID : {'\n'+app.apps[0].options.projectId}
                </Text>
            </View>
            <View>
                <Button
                    title="click me"
                    color="#3461eb"
                    onPress={()=> props.navigation.navigate('Entry')}
                    />
            </View>
        </View>
    )
}

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
        textAlign: 'center'
    }
});


export default Home;