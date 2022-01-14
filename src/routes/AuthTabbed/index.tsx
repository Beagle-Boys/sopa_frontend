import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import Icon from 'react-native-vector-icons/FontAwesome';

import Home from '../../screens/Home';
import AddLocation from '../../screens/AddLocation';
import StarredLocation from '../../screens/StarredLocation';

const Tab = createMaterialBottomTabNavigator();

const AuthTabbed = () => {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            activeColor="#000"
            barStyle={{ backgroundColor: '#f9f9f9' }}
        >
            <Tab.Screen
                name="Starred"
                options={{
                    tabBarLabel: 'Starred',
                    tabBarIcon: ({ color }) => (
                        <Icon name="star-o" color={color} size={26} />
                    ),
                }}
                component={StarredLocation} />
            <Tab.Screen
                name="Add"
                options={{
                    tabBarLabel: 'Add',
                    tabBarIcon: ({ color }) => (
                        <Icon name="camera" color={color} size={26} />
                    ),
                }}
                component={AddLocation} />
            <Tab.Screen
                name="Map"
                options={{
                    tabBarLabel: 'Map',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" color={color} size={26} />
                    ),
                }}
                component={Home} />
        </Tab.Navigator>
    )
}

export default AuthTabbed
