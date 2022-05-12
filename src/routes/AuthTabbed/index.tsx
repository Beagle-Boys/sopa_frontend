import React, { useState } from "react";

import Icon from "react-native-vector-icons/FontAwesome";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "../../screens/Home";
import AddLocation from "../../screens/AddLocation";
import StarredLocation from "../../screens/StarredLocation";
import HomeStack from "../HomeStack";

import { TabProvider } from ".././../context/TabContext";

const Tab = createMaterialTopTabNavigator();

const AuthTabbed = () => {
  const [hide, setHide] = useState(false);
  return (
    <TabProvider>
      <Tab.Navigator
        tabBarPosition="bottom"
        initialRouteName="Map"
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "#F9F9F9", height: hide ? 0 : 60 },
        }}
      >
        <Tab.Screen
          name="Starred"
          options={{
            tabBarLabel: "Starred",
            tabBarIcon: ({ color }) => (
              <Icon name="star-o" color={color} size={26} />
            ),
          }}
          component={StarredLocation}
        />
        <Tab.Screen
          name="Map"
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={26} />
            ),
          }}
          component={Home}
          initialParams={{ setHide }}
        />
        <Tab.Screen
          name="Add"
          options={{
            tabBarLabel: "Add",
            tabBarIcon: ({ color }) => (
              <Icon name="camera" color={color} size={22} />
            ),
            swipeEnabled: !hide,
          }}
          component={AddLocation}
          initialParams={{ setHide }}
        />
      </Tab.Navigator>
    </TabProvider>
  );
};

export default AuthTabbed;
