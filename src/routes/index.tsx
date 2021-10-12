import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { useFirebaseContext } from '../context/FirebaseContext';

import Home from '../screens/Home';
import Second from '../screens/Second';
import SignUp from '../screens/SignUp';

const Stack = createStackNavigator();

const TransitionScreenOptions = {
    ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
};

const AuthRoute = () => {
    return (
        <Stack.Navigator screenOptions={TransitionScreenOptions} initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: 'First Screen'
                }} />
            <Stack.Screen
                name="Entry"
                component={Second} />
        </Stack.Navigator>
    );
};

const UnauthRoute = () => {
    return (
        <Stack.Navigator screenOptions={TransitionScreenOptions} initialRouteName="Signup">
            <Stack.Screen
                name="Signup"
                component={SignUp} />
            <Stack.Screen
                name="Entry"
                component={Second} />
        </Stack.Navigator>
    );
}

export const Route = () => {
    const { user } = useFirebaseContext();
    if (user) return <AuthRoute />;
    return <UnauthRoute />;
}