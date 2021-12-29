import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

import Icon from 'react-native-vector-icons/Ionicons'

const StarredLocation = () => {
    return(
        <View style={{backgroundColor: "#E4D00A", flex: 1}}>
            <Text style={styles.center}>
                Starred Locations List
            </Text>
            <Icon name="close" size={100} color="#fff" />
        </View>
    )
}

export default StarredLocation;