import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Second = () => {
    return(
        <View>
            <Text style={styles.center}>
                Button Clicked
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        textAlign: 'center',
        padding: 50
    }
});

export default Second;