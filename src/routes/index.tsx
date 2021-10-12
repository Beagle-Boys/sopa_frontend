import React from 'react';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { useFirebaseContext } from '../context/FirebaseContext';

import Home from '../screens/Home';
import Second from '../screens/Second';
import SignUp from '../screens/SignUp';
import Landing from '../screens/Landing';
import SignIn from '../screens/SignIn';

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
        <Stack.Navigator screenOptions={TransitionScreenOptions} initialRouteName="Landing">
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="Landing"
                component={Landing}
                options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export const Route = () => {
    const { what } = useFirebaseContext();
    if (what) return <AuthRoute />;
    return <UnauthRoute />;
}