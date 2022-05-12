import React, { useEffect } from "react";
import { PermissionsAndroid, Text } from "react-native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";

import Second from "../screens/Second";
import SignUp from "../screens/SignUp";
import Landing from "../screens/Landing";
import SignIn from "../screens/SignIn";
import Premium from "../screens/Premium";
import RentLocation from "../screens/RentLocation";
import AuthTabbed from "./AuthTabbed";
import { useAuthContext } from "../context/AuthContext";
import DrawerRoute from "./DrawerRoute";
import SpotFull from "../screens/SpotFull";

// import SplashScreen from "react-native-splash-screen";

const Stack = createStackNavigator();

const TransitionScreenOptions = {
  ...TransitionPresets.DefaultTransition, // This is where the transition happens
};

const AuthRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={TransitionScreenOptions}
      initialRouteName="Main"
    >
      <Stack.Screen
        name="Main"
        component={DrawerRoute}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Rent" component={RentLocation} />

      <Stack.Screen name="Spot" component={SpotFull} />

      <Stack.Screen name="Entry" component={Second} />

      <Stack.Screen name="Premium" component={Premium}
    options={{headerTitle: "SOPA Premium"}}
      />
    </Stack.Navigator>
  );
};

const UnauthRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={TransitionScreenOptions}
      initialRouteName="Landing"
    >
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Landing"
        component={Landing}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

export const Route = () => {
  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then((granted) => {
        console.log(granted);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);
  const { x_sopa_key } = useAuthContext();
  useEffect(() => {
    // SplashScreen.hide();
  }, [x_sopa_key]);

  if (x_sopa_key) return <AuthRoute />;
  return <UnauthRoute />;
};
