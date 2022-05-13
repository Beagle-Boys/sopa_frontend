import React, { useEffect } from "react";

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
import FA5 from "react-native-vector-icons/FontAwesome5"

const Drawer = createDrawerNavigator();

const DrawerRoute = () => {
    return (
        // <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="Home" drawerContent={CustomDrawerContent}>
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
    const { profile_pic, user_detail, logout } = useAuthContext();
    useEffect(() => {
        console.log("PROFILE SVG =======")
        console.log(profile_pic);
    }, [profile_pic])
    return (
        <DrawerContentScrollView {...props}
            style={{}}
            contentContainerStyle={{ flex: 1 }}
        >
            <View style={{ width: "100%", height: 150, backgroundColor: user_detail?.type == "PREMIUM" ? "#ffbf00" : "#aef", padding: 20, justifyContent: "flex-end", marginBottom: 20 }}>
                <View style={{ flexDirection: "row", }}>
                    <SvgUri height={90} width={90} svgXmlData={profile_pic} />
                    <View style={{ paddingHorizontal: 10, justifyContent: "center", paddingBottom: 5 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user_detail?.userName}</Text>
                        <Text style={{ fontSize: 12 }}>{user_detail?.email}</Text>
                    </View>

                </View>
            </View>
            <DrawerItemList {...props} />
            <View style={{  width: "100%", position: "absolute", bottom: 0, paddingHorizontal: 15, paddingBottom: 10 }}>
                <Pressable
                    style={({pressed}) => [{
                        padding: 10,
                        backgroundColor: "#7f00ff",
                        borderRadius: 10,
                        flexDirection: "row",
                        justifyContent: "center"
                    }, pressed && {
                        opacity: 0.5
                    }]}
                    onPress={() => props.navigation.navigate("Premium")}

                >
                    <FA5 name="crown" size={19} color="#ffbf00"/>
                    <Text style={{ fontSize: 17, color: "#fff", textAlign: "center", marginLeft: 10 }}>
                        Get Premium
                    </Text>
                </Pressable>
                <Pressable
                    style={({pressed}) => [{
                        padding: 8,
                        backgroundColor: "#fff",
                        borderWidth: 2,
                        borderColor: "#ff326f",
                        borderRadius: 10,
                        marginVertical: 10
                    }, pressed && {
                        backgroundColor: "#ff326f",
                        color: "white"
                    }]}
                    onPress={() => logout()}
                >
                    <Text style={{ fontSize: 17, color: "#ff326f", textAlign: "center" }}>
                        Logout
                    </Text>
                </Pressable>

            </View>
        </DrawerContentScrollView>
    );
}

export default DrawerRoute;
