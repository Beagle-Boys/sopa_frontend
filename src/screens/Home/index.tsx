import React from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import app from '@react-native-firebase/app';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthContext } from '../../context/AuthContext';
import { TextInput } from 'react-native-gesture-handler';

const Home = (props: any) => {
    const { setAuth } = useAuthContext();
    return(
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Pressable style={styles.menuBtn}>
                    <Icon name="menu" size={24} color="#000" />
                </Pressable>
                <TextInput 
                style={styles.searchInput}
                placeholder="Enter Location"
                />
            </View>
        </View>
    )
}


export default Home;