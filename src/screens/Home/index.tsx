import React from "react";
import { View, Text, Button, Pressable, Dimensions } from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken(
  "sk.eyJ1IjoiYW51cmFxIiwiYSI6ImNreHVsanZrYzJ1bjQycGtvdXk4dW1nZ2YifQ.GkpyynQmykNnhkdEcGN7KQ"
);

const { width, height } = Dimensions.get("window");

const Home = (props: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Pressable style={styles.menuBtn}>
          <Icon name="menu" size={24} color="#000" />
        </Pressable>
        <TextInput style={styles.searchInput} placeholder="Enter Location" />
      </View>
      <View style={{ height: height, width: width }}>
        <MapboxGL.MapView style={{ flex: 1 }} />
      </View>
    </View>
  );
};

export default Home;
