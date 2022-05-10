import React from "react";

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
// import { NavigationContainer } from "@react-navigation/native";

import AuthTabbed from "../AuthTabbed";
import StarredLocation from "../../screens/RentLocation";
import Profile from "../../screens/Profile";
import Reservation from "../../screens/Reservation";
import { Text, View, Pressable } from "react-native";
import { useAuthContext } from "../../context/AuthContext";
import SvgUri from "react-native-svg-uri";

const Drawer = createDrawerNavigator();

const DrawerRoute = () => {
    return (
        // <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="Profile" drawerContent={CustomDrawerContent}>
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
function CustomDrawerContent(props) {
    const { profile_pic, user_detail } = useAuthContext();
    return (
        <DrawerContentScrollView {...props}
            style={{}}
            contentContainerStyle={{ flex: 1 }}
        >
            <View style={{ width: "100%", height: 150, backgroundColor: "#aef", padding: 20, justifyContent: "flex-end", marginBottom: 20 }}>
                <View style={{ flexDirection: "row" }}>
                        <SvgUri svgXmlData={profile_pic} height={70} width={70} />
                    <Text>{user_detail?.userName}</Text>
                </View>
            </View>
            <DrawerItemList {...props} />
            <View style={{ backgroundColor: "green", width: "100%", position: "absolute", bottom: 0 }}>
                <Pressable
                    style={{
                        padding: 10,
                        backgroundColor: "#7f00ff",
                    }}
                    onPress={() => props.navigation.navigate("Premium")}

                >
                    <Text style={{ fontSize: 17, color: "#fff", textAlign: "center" }}>
                        Get Premium
                    </Text>
                </Pressable>
                <Pressable
                    style={{
                        padding: 10,
                        backgroundColor: "#ff326f",
                    }}
                    onPress={() => logout()}
                >
                    <Text style={{ fontSize: 17, color: "#fff", textAlign: "center" }}>
                        Logout
                    </Text>
                </Pressable>

            </View>
        </DrawerContentScrollView>
    );
}

export default DrawerRoute;
