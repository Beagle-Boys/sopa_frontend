import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const AddLocation = () => {
    return(
        <View style={{backgroundColor: "#7FFFD4", flex: 1}}>
            <Text style={styles.center}>
                Add Location Page
            </Text>
        </View>
    )
}

export default AddLocation;