import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Home = (props) => {
    return(
        <View style={styles.container}>
            <View>
                <Button
                    title="click me"
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
        justifyContent: 'center' 
    }
});


export default Home;