import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  Easing,
} from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCom from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import ShowImages from "../ShowImages";

const { height, width } = Dimensions.get("screen");

const FloatingCard = ({ floatExit }) => {
  const Ypos = useRef(new Animated.Value(400)).current;

  floatExit = () => {
    Animated.timing(Ypos, {
      toValue: 400,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.back(1)),
    }).start();
  };

  useEffect(() => {
    Animated.timing(Ypos, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.back(1)),
    }).start();

    return () => console.log("USE EFFECT RETURN");
    //   Animated.timing(Ypos, {
    //   toValue: 400,
    //   duration: 500,
    //   useNativeDriver: true,
    //   easing: Easing.inOut(Easing.back(1)),
    // }).start();
  }, []);
  useLayoutEffect(() => {
    return () => {
      console.log("USE LAYOUT EFFECT RETURN");
      Animated.timing(Ypos, {
        toValue: 400,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.back(1)),
      }).start();
    };
  }, []);
  const images = [
    {
      uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
    },
    {
      uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
    },
    {
      uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    },
  ];

  return (
    <Animated.View style={[styles.container, { translateY: Ypos }]}>
      {/* Heading and subheading */}
      <View
        style={{
          flexDirection: "row",
          width: "80%",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 20 }}>Location Name</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Icon name="location" size={20} color="black" />
            <Text>7 km</Text>
          </View>
        </View>
        <View style={{ display: "flex", justifyContent: "center" }}>
          <Text
            style={{ color: "white", backgroundColor: "#bA3434", padding: 5 }}
          >
            private
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: height * 0.2,
        }}
      >
        <ScrollView horizontal={true} style={{ paddingStart: 10 }}>
          {images.map(({ uri }, index) => (
            <Image
              source={{ uri, width: 200, height: height * 0.2 }}
              key={index}
              style={{ marginHorizontal: 5 }}
            />
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          alignSelf: "flex-start",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialCom name="clock-outline" size={20} />
          <Text style={{ marginStart: 10 }}>
            last visited 2 hrs ago by a SOPA user.
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Octicons name="graph" size={20} />

          <Text style={{ marginStart: 10 }}>
            high number of user parking this hour.
          </Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
      >
        <Pressable
          style={{
            paddingHorizontal: 30,
            borderRadius: 10,
            paddingVertical: 5,
            backgroundColor: "#923ed3",
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>BOOK</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default FloatingCard;
