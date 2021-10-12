import React from 'react';
import { View, Text, Button } from 'react-native';
import app from '@react-native-firebase/app';
import styles from './styles';

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


export default Home;