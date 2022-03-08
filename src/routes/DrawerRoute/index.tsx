import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
// import { NavigationContainer } from "@react-navigation/native";

import AuthTabbed from "../AuthTabbed";
import StarredLocation from "../../screens/RentLocation";
import Profile from "../../screens/Profile";
import Reservation from "../../screens/Reservation";

const Drawer = createDrawerNavigator();

const DrawerRoute = () => {
  return (
    // <NavigationContainer independent={true}>
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={AuthTabbed}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Reservation" component={Reservation} />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        // options={{ headerShown: false }}
      />
    </Drawer.Navigator>
    // </NavigationContainer>
  );
};

export default DrawerRoute;
