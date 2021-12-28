import React from 'react';
import { View, Text, Button } from 'react-native';
import app from '@react-native-firebase/app';
import styles from './styles';
import { useAuthContext } from '../../context/AuthContext';

const Home = (props: any) => {
    const { setAuth } = useAuthContext();
    return(
        <View style={styles.container}>
            <View style={styles.appName}>
                <Text style={styles.appText}>
                    Success
                    {/* Firebase Project ID : {'\n'+app.apps[0].options.projectId} */}
                </Text>
            </View>
            <View>
                <Button
                    title="click me"
                    color="#3461eb"
                    onPress={()=> props.navigation.navigate('Entry')}
                    />
            </View>
            <View style={{marginTop: 10}}>
                <Button
                    title="log out"
                    color="#3461eb"
                    onPress={()=> setAuth(null)}
                    />
            </View>
        </View>
    )
}


export default Home;